import { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import DateTimePicker from '@react-native-community/datetimepicker'
import { zodResolver } from '@hookform/resolvers/zod'
import { Service, UpdateService } from '@/types/services.types'
import { serviceSchema } from '@/schema/service.schema'
import MaskInput from 'react-native-mask-input';

function timeToHHMM(d: Date) {
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}
function hhmmToDate(hhmm: string) {
  const [hh, mm] = hhmm.split(':').map(Number)
  const now = new Date()
  now.setHours(Number.isFinite(hh) ? hh : 0, Number.isFinite(mm) ? mm : 0, 0, 0)
  return now
}
 
type FormProps = {
    initialData?: UpdateService
}

export function ServiceForm({ initialData }:FormProps) {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<Service | UpdateService>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      availabilities: [], // items start empty
    },
  })

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'availabilities',
  })

  // qual picker está aberto: index + field('start'|'end')
  const [openPicker, setOpenPicker] = useState<{
    index: number
    field: 'start' | 'end'
  } | null>(null)
  // quando abrir o picker, precisamos de um Date value; se campo vazio, usamos now (não grava até seleção)
  const [pickerInitialDate, setPickerInitialDate] = useState<Date>(new Date())

  const DAYS = [
    { id: 1, label: 'Dom' },
    { id: 2, label: 'Seg' },
    { id: 3, label: 'Ter' },
    { id: 4, label: 'Qua' },
    { id: 5, label: 'Qui' },
    { id: 6, label: 'Sex' },
    { id: 7, label: 'Sáb' },
  ]

  useEffect(() => {
    if (!initialData) return
    
    const normalized = {
        ...initialData,
        availabities: initialData.availabilities.map(a => ({
            id: a.id,
            dayId: a.dayId,
            startTime: timeToHHMM(new Date(a.startTime)),
            endTime: timeToHHMM(new Date(a.endTime))
        }))
    }
    reset(normalized)
  },[initialData])
  // adiciona um availability vazio (sem startTime/endTime)
  const addAvailability = () => {
    append({ dayId: 0, startTime: '', endTime: '' } as any)
  }

  // abre picker; se campo tiver valor, usa ele como inicial, senão usa now
  const openTimePicker = (index: number, field: 'start' | 'end') => {
    const f = fields[index]
    const cur = f ? (field === 'start' ? f.startTime : f.endTime) : ''
    setPickerInitialDate(cur ? hhmmToDate(String(cur)) : new Date())
    setOpenPicker({ index, field })
  }

  const onPickerChange = (_e: any, selected?: Date) => {
    if (!openPicker) return
    const { index, field } = openPicker
    setOpenPicker(null)
    if (!selected) return // user cancelled

    const hhmm = timeToHHMM(selected)
    const item = fields[index]
    if (!item) return

    const updated = {
      ...item,
      ...(field === 'start' ? { startTime: hhmm } : { endTime: hhmm }),
    }
    update(index, updated as any)

    // checagem simples imediata: se ambos preenchidos validar start < end
    if (updated.startTime && updated.endTime) {
      const [sh, sm] = updated.startTime.split(':').map(Number)
      const [eh, em] = updated.endTime.split(':').map(Number)
      if (eh < sh || (eh === sh && em <= sm)) {
        setError(`availabilities.${index}.endTime` as const, {
          type: 'manual',
          message: 'end_time deve ser maior que start_time',
        })
      } else {
        clearErrors(`availabilities.${index}.endTime` as const)
      }
    }
  }

  const onSubmit = (data: Service) => {
    // Zod resolver já validou, se chegou aqui está ok
    console.log('payload pronto:', data)
    // enviar para API...
  }

  return (
    <View style={{ padding: 12 }}>
      <Text>Nome do serviço</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Nome do serviço"
            style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
          />
        )}
      />
      {errors.name && (
        <Text style={{ color: 'red' }}>{String(errors.name.message)}</Text>
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <Text>Disponibilidades</Text>
        <Button title="+ Adicionar" onPress={addAvailability} />
      </View>

      <FlatList
        data={fields}
        keyExtractor={f => f.id}
        renderItem={({ item, index }) => (
          <View style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}>
            <Text>Disponibilidade #{index + 1}</Text>

            {/* dayId selector */}
            <Controller
              control={control}
              name={`availabilities.${index}.dayId` as const}
              render={({ field: { onChange, value } }) => (
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  {DAYS.map(d => (
                    <TouchableOpacity
                      key={d.id}
                      onPress={() => onChange(d.id)}
                      style={{
                        marginRight: 6,
                        padding: 6,
                        borderWidth: 1,
                        backgroundColor: value === d.id ? '#ddd' : undefined,
                      }}
                    >
                      <Text>{d.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
            {errors.availabilities?.[index]?.dayId && (
              <Text style={{ color: 'red' }}>
                {String(errors.availabilities?.[index]?.dayId?.message)}
              </Text>
            )}

            {/* startTime / endTime — iniciam vazios e o usuário escolhe */}
            <Controller
              control={control}
              name={`availabilities.${index}.startTime` as const}
              render={({ field: {onBlur, onChange, value} }) => (
                <View style={{ marginTop: 8 }}>
                  <Text>Início: {value || '(não definido)'}</Text>
                  {Platform.OS === 'web' ? (
                    <MaskInput
                      value={value}
                      onBlur={onBlur}
                      placeholder="Horário (HH:MM)"
                      onChange={onChange}
                      keyboardType="numeric"
                      maxLength={5}
                      mask={[/\d/, /\d/, ":", /\d/, /\d/]}
                    />
                  ) : (
                    <Button
                      title="Selecionar Hora"
                      onPress={() => openTimePicker(index, 'start')}
                    />
                  )}
                </View>
              )}
            />
            <Controller
              control={control}
              name={`availabilities.${index}.endTime` as const}
              render={({ field: {onBlur, onChange, value} }) => (
                <View style={{ marginTop: 8 }}>
                  <Text>Fim: {value || '(não definido)'}</Text>
                  {Platform.OS === 'web' ? (
                    <MaskInput
                      value={value}
                      onBlur={onBlur}
                      placeholder="Horário (HH:MM)"
                      onChange={onChange}
                      keyboardType="numeric"
                      maxLength={5}
                      mask={[/\d/, /\d/, ":", /\d/, /\d/]}
                    />
                  ) : (
                    <Button
                      title="Selecionar Hora"
                      onPress={() => openTimePicker(index, 'end')}
                    />
                  )}
                </View>
              )}
            />

            {errors.availabilities?.[index]?.startTime && (
              <Text style={{ color: 'red' }}>
                {String(errors.availabilities?.[index]?.startTime?.message)}
              </Text>
            )}
            {errors.availabilities?.[index]?.endTime && (
              <Text style={{ color: 'red' }}>
                {String(errors.availabilities?.[index]?.endTime?.message)}
              </Text>
            )}

            <View style={{ marginTop: 8 }}>
              <Button title="Remover" onPress={() => remove(index)} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhuma disponibilidade</Text>}
      />

      <Button title="Salvar" onPress={handleSubmit(onSubmit)} />

      {/* DateTimePicker global controlado */}
      {openPicker && (
        <DateTimePicker
          value={pickerInitialDate}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour
          onChange={(e, d) => onPickerChange(e, d ?? undefined)}
        />
      )}
    </View>
  )
}
