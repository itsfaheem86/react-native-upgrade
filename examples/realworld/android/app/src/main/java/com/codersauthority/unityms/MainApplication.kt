package com.codersauthority.unityms

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import android.content.Context

// UDEV START
// Ref: https://github.com/facebook/react-native/issues/41288#issuecomment-2238831683
import android.content.BroadcastReceiver
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import org.jetbrains.annotations.Nullable
// UDEV END

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)


  // UDEV START
  // Ref: https://github.com/facebook/react-native/issues/41288#issuecomment-2238831683
  override fun registerReceiver(receiver: BroadcastReceiver?, filter: IntentFilter): Intent? {
    return if (Build.VERSION.SDK_INT >= 34 && applicationInfo.targetSdkVersion >= 34) {
      super.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED)
    } else {
      super.registerReceiver(receiver, filter)
    }
  }
  // UDEV END

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}
