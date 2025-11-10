import { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  Platform,
  StyleSheet,
} from 'react-native'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import DateTimePicker from '@react-native-community/datetimepicker'
import { zodResolver } from '@hookform/resolvers/zod'
import { Service, UpdateService } from '@/types/services.types'
import { serviceSchema } from '@/schema/service.schema'
import MaskInput from 'react-native-mask-input'
import { hhmmToDate, timeToHHMM } from '@/utils/datetime'

type FormProps = {
  initialData?: UpdateService
  onSubmit: (data: any) => Promise<void>
  isPending: boolean
}

export function ServiceForm({ initialData, onSubmit, isPending }: FormProps) {
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
      availabilities: [],
    },
  })

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'availabilities',
  })

  const [openPicker, setOpenPicker] = useState<{ index: number; field: 'start' | 'end' } | null>(
    null,
  )
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
      availabilities: initialData.availabilities.map(a => ({
        id: a.id,
        dayId: a.dayId,
        startTime: timeToHHMM(new Date(a.startTime)),
        endTime: timeToHHMM(new Date(a.endTime)),
      })),
    }
    reset(normalized)
  }, [initialData])

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
    if (!selected) return

    const hhmm = timeToHHMM(selected)
    const item = fields[index]
    if (!item) return

    const updated = {
      ...item,
      ...(field === 'start' ? { startTime: hhmm } : { endTime: hhmm }),
    }
    update(index, updated as any)

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nome do serviço</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Nome do serviço"
            style={[styles.input, errors.name && { borderColor: '#ef4444' }]}
          />
        )}
      />
      {errors.name && <Text style={styles.errorText}>{String(errors.name.message)}</Text>}

      <View style={styles.row}>
        <Text style={styles.secondaryText}>Disponibilidades</Text>
        <TouchableOpacity
          onPress={() => append({ dayId: 0, startTime: '', endTime: '' } as any)}
          style={[styles.button, { paddingVertical: 10, paddingHorizontal: 15 }]}
        >
          <Text style={styles.buttonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={fields}
        keyExtractor={f => f.id}
        renderItem={({ index }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Disponibilidade #{index + 1}</Text>

            <Controller
              control={control}
              name={`availabilities.${index}.dayId` as const}
              render={({ field: { onChange, value } }) => (
                <View style={styles.daysRow}>
                  {DAYS.map(d => (
                    <TouchableOpacity
                      key={d.id}
                      onPress={() => onChange(d.id)}
                      style={[
                        styles.dayButton,
                        value === d.id && styles.dayButtonActive,
                      ]}
                    >
                      <Text>{d.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
            {errors.availabilities?.[index]?.dayId && (
              <Text style={styles.errorText}>
                {String(errors.availabilities?.[index]?.dayId?.message)}
              </Text>
            )}

            {/* horários sem mexer em lógica */}
            <Controller
              control={control}
              name={`availabilities.${index}.startTime` as const}
              render={({ field: { onBlur, onChange, value } }) => (
                <View style={{ marginTop: 8 }}>
                  <Text>Início: {value || '(não definido)'}</Text>
                  {Platform.OS === 'web' ? (
                    <MaskInput
                      value={value}
                      onBlur={onBlur}
                      placeholder="HH:MM"
                      onChange={onChange}
                      keyboardType="numeric"
                      maxLength={5}
                      mask={[/\d/, /\d/, ':', /\d/, /\d/]}
                      style={styles.input}
                    />
                  ) : (
                    <Button title="Selecionar Hora" onPress={() => openTimePicker(index, 'start')} />
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name={`availabilities.${index}.endTime` as const}
              render={({ field: { onBlur, onChange, value } }) => (
                <View style={{ marginTop: 8 }}>
                  <Text>Fim: {value || '(não definido)'}</Text>
                  {Platform.OS === 'web' ? (
                    <MaskInput
                      value={value}
                      onBlur={onBlur}
                      placeholder="HH:MM"
                      onChange={onChange}
                      keyboardType="numeric"
                      maxLength={5}
                      mask={[/\d/, /\d/, ':', /\d/, /\d/]}
                      style={styles.input}
                    />
                  ) : (
                    <Button title="Selecionar Hora" onPress={() => openTimePicker(index, 'end')} />
                  )}
                </View>
              )}
            />

            {errors.availabilities?.[index]?.endTime && (
              <Text style={styles.errorText}>
                {String(errors.availabilities?.[index]?.endTime?.message)}
              </Text>
            )}

            <TouchableOpacity
              onPress={() => remove(index)}
              style={[styles.button, { backgroundColor: '#ef4444' }]}
            >
              <Text style={styles.buttonText}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.secondaryText}>Nenhuma disponibilidade</Text>}
      />

      <TouchableOpacity
        style={[styles.button, isPending && { opacity: 0.6 }]}
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dcefe0',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#c3d6c8',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
  },
  secondaryText: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: '#c3d6c8',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 6,
  },
  dayButton: {
    borderWidth: 1,
    borderColor: '#c3d6c8',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
    backgroundColor: '#fff',
  },
  dayButtonActive: {
    backgroundColor: '#bbf7d0',
    borderColor: '#22c55e',
  },
})
