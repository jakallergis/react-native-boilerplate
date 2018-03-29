package com.reactnativeboilerplate;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ReactNativeBoilerplate";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {

            @Override
            protected Bundle getLaunchOptions() {
                Bundle initialProps = new Bundle();
                initialProps.putBoolean("isTablet", getResources().getBoolean(R.bool.isTablet));
                return initialProps;
            }
        };
    }
}
