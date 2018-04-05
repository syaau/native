package com.bhoos.reactnative.app;

import android.app.Activity;
import android.view.View;
import android.view.ViewGroup;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.*;

import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by ranjanshrestha on 4/4/18.
 */

public class RNAppModule extends ReactContextBaseJavaModule {
  private static WeakReference<View> rootView = null;
  private static String moduleName = null;

  public static void setup(ReactActivity reactActivity, String moduleName, int splash) {
    ViewGroup view = reactActivity.findViewById(android.R.id.content);
    rootView = new WeakReference<View>(view.getChildAt(0));
    RNAppModule.moduleName = moduleName;
    reactActivity.setContentView(splash);
  }

  RNAppModule(final ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "RNApp";
  }

  @Override
  public Map<String, Object> getConstants() {
    // ReactActivity activity = (ReactActivity) getCurrentActivity();
    final Map<String, Object> constants = new HashMap<>();
    constants.put("moduleName", moduleName);

    return constants;
  }

  @ReactMethod
  public void activate() {
    if (rootView != null) {
      Activity activity = getCurrentActivity();
      if (activity instanceof ReactActivity) {
        activity.runOnUiThread(new Runnable() {
          @Override
          public void run() {
            View root = rootView.get();
            rootView = null;
            if (root != null) {
              getCurrentActivity().setContentView(root);
            }
          }
        });
      }
    }
  }
}

