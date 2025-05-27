import dayjs from "dayjs";
import apiRequest from "../services/apiRequest";
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

export async function updateSubscription(email, password) {
  await apiRequest(
    'subscriptions', 
    'GET', 
    null,
    {
      email,
      password
    }
  ).then(res => {
    SecureStoragePlugin.set({key: 'subscription', value: JSON.stringify(res.data)})
  }).catch();
}

const useSubscription = async () => {
  const credentials = await SecureStoragePlugin.get({key: 'credentials'})
    .then(res => JSON.parse(res.value))
  
  const subscription = await SecureStoragePlugin.get({key:'subscription'})
    .then(res => JSON.parse(res.value))
    .catch(() => ({
      isActive: false,
      expiresAt: dayjs()
    }))

  updateSubscription(credentials.email, credentials.password)

  async function cancelSubscription() {
    await apiRequest(
      'subscriptions/cancel', 
      'DELETE', 
      null,
      {
        email: credentials.email,
        password: credentials.password,
      }
    )
  }
  const today = dayjs();
  const expirationDate = dayjs(subscription.expiresAt);
  return {
    isActive: subscription.isActive && today.isBefore(expirationDate),
    expirationDate: expirationDate,
    cancelSubscription
  };
}
 
export default useSubscription;