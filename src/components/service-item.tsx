import { ROLE } from '@/constants/roles'
import { styles } from '@/styles'
import type { UpdateService } from '@/types/services.types'
import { Text, View, Pressable, StyleSheet } from 'react-native'


const DAY_NAMES: Record<number, string> = {
  1: 'Dom',
  2: 'Seg',
  3: 'Ter',
  4: 'Qua',
  5: 'Qui',
  6: 'Sex',
  7: 'Sáb',
}

type ServiceItemProps = {
  id: number
  name: string
  availabilities: {
    dayId: number
    startTime: string
    endTime: string
    id: number
  }[]
  onDelete: (service: UpdateService) => Promise<void>
  onPress: () => void
  role: 'user' | 'admin'
}

export function ServiceItem({
  id,
  name,
  availabilities,
  onDelete,
  onPress,
  role,
}: ServiceItemProps) {
  const handleDelete = async () => {
    await onDelete({ id, name, availabilities })
  }

  return (
    <View
      style={[
        styles.input,
        {
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          marginBottom: 10,
        },
      ]}
    >

      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text onPress={onPress} style={styles.title}>
          {name}
        </Text>
        {role === ROLE.ADMIN ? (
          <Pressable
            onPress={handleDelete}
            style={{
              backgroundColor: '#ff4d4d',
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>X</Text>
          </Pressable>
        ) : null}
      </View>

      {availabilities.length > 0 ? (
        <View style={{ marginTop: 6 }}>
          {availabilities.map(avail => {
            const day = DAY_NAMES[avail.dayId] || `Dia ${avail.dayId}`

            const start = new Date(avail.startTime).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })
            const end = new Date(avail.endTime).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })

            return (
              <Text key={avail.id} style={localStyles.availabilityText}>
                📅 {day} — {start} às {end}
              </Text>
            )
          })}
        </View>
      ) : (
        <Text style={localStyles.noAvailability}>Sem horários cadastrados</Text>
      )}
    </View>
  )
}

const localStyles = StyleSheet.create({
  availabilityText: {
    fontSize: 14, 
    color: '#333',
    marginTop: 2,
  },
  noAvailability: {
    fontSize: 13,
    color: '#777',
    fontStyle: 'italic',
    marginTop: 4,
  },
})
