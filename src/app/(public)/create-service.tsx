import { ServiceForm } from '@/components/service-form'
import { useCreateServiceViewModel } from '@/hooks/viewmodel/use-create-service-view-model'
import { View } from 'react-native'

export default function CreateService() {
  const { isPending, onSubmit } = useCreateServiceViewModel()

  return (
    <View style={{ padding: 12 }}>
      <ServiceForm onSubmit={onSubmit} isPending={isPending} />
    </View>
  )
}
