package com.traceless;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import cn.reactnative.modules.update.UpdatePackage;
import org.reactnative.camera.RNCameraPackage;
import com.rnfs.RNFSPackage;
import com.horcrux.svg.SvgPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.pusherman.networkinfo.RNNetworkInfoPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import org.pgsqlite.SQLitePluginPackage;
import cn.jpush.reactnativejpush.JPushPackage;
import com.traceless.nativeJava.AnExampleReactPackage;
import cn.reactnative.modules.update.UpdateContext;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

// 设置为 true 将不会弹出 toast
    private boolean SHUTDOWN_TOAST = true;
    // 设置为 true 将不会打印 log
    private boolean SHUTDOWN_LOG = true;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }
     @Override
        protected String getJSBundleFile() {
            return UpdateContext.getBundleUrl(MainApplication.this);
        }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNDeviceInfo(),
            new UpdatePackage(),
            new RNCameraPackage(),
            new RNFSPackage(),
            new SvgPackage(),
            new PickerPackage(),
            new VectorIconsPackage(),
            new RNNetworkInfoPackage(),
            new ImageResizerPackage(),
            new ImagePickerPackage(),
            new RNFetchBlobPackage(),
              new SQLitePluginPackage(),
              new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
              new AnExampleReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
