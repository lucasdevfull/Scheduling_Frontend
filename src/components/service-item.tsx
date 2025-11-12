import { styles } from '@/styles'
import { Text, View } from 'react-native'

type ServiceItemProps = {
  name: string
}
export function ServiceItem({ name }: ServiceItemProps) {
  return (
    <View style={styles.input}>
      {/* usando input só para reaproveitar padding/borda */}
      <Text style={styles.title}>{name}</Text>
      {/* <Text>{item.}</Text>
        <Text>
          📅 {item.data} ⏰ {item.hora}
        </Text> */}
    </View>
  )
}
