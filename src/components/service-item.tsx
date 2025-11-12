import { ROLE } from '@/constants/roles'
import { styles } from '@/styles'
import type { UpdateService } from '@/types/services.types'
import { Text, View, Pressable } from 'react-native'

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
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
      ]}
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
  )
}
