import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "KitchenQueue"
    self.dependencyProvider = RCTAppDependencyProvider()

    FirebaseApp.configure()

    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    // ✅ Dynamic Metro host resolution
    if let metroHost = ProcessInfo.processInfo.environment["RCT_METRO_HOST"] {
      // If Xcode Scheme sets RCT_METRO_HOST, always use that
      return URL(string: "http://\(metroHost):8081/index.bundle?platform=ios")
    } else {
      // Otherwise fall back to RN’s default behavior (auto-detect)
      return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    }
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
