package com.kitchenqueue.kitchenque

import android.content.pm.ActivityInfo
import android.content.res.Configuration
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "KitchenQueue"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Lock phones to portrait only
    if (!isTablet()) {
      requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
    }
  }

  private fun isTablet(): Boolean {
    val screenLayout = resources.configuration.screenLayout and Configuration.SCREENLAYOUT_SIZE_MASK
    return screenLayout >= Configuration.SCREENLAYOUT_SIZE_LARGE
  }
}
