import React, {useEffect} from 'react';

import Main from './src/Main';

import {Provider, connect} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import 'react-native-gesture-handler';
import persist from './src/config/store';
const persistStore = persist();
import PushNotification from 'react-native-push-notification';
import {fcmService} from './src/components/FCMService';
import {localNotificationService} from './src/components/LocalNotificationService';

export default function App() {
  useEffect(() => {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    function onRegister(token) {
      console.log('[App] onRegister: ', token);
    }

    function onNotification(notify) {
      console.log('[App] onNotification: ', notify);
      const options = {
        soundName: 'default',
        playSound: true, //,
        // largeIcon: 'ic_launcher', // add icon large for Android (Link: app/src/main/mipmap)
        // smallIcon: 'ic_launcher' // add icon small for Android (Link: app/src/main/mipmap)
      };
      localNotificationService.showNotification(
        0,
        notify.title,
        notify.body,
        notify,
        options,
      );
    }

    function onOpenNotification(notify) {
      console.log('[App] onOpenNotification: ', notify);
      alert('Open Notification: ' + notify.body);
    }

    return () => {
      console.log('[App] unRegister');
      fcmService.unRegister();
      localNotificationService.unregister();
    };
  }, []);
  return (
    <Provider store={persistStore.store}>
      <PersistGate loading={null} persistor={persistStore.persistor}>
        <Main />
      </PersistGate>
    </Provider>
  );
}
