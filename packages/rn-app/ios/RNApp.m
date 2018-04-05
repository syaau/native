#import "RNApp.h"
#import <React/RCTBridge.h>
#import <React/RCTRootView.h>

//static bool waiting = true;
//static boolean addedJsLoadErrorObserver = false;
static UIViewController* gController;
static RCTRootView* gRootView;

@implementation RNApp

- (dispatch_queue_t)methodQueue{
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

+ (void)setup:(UIViewController *)controller withRootView:(RCTRootView *)rootView {
    gController = controller;
    gRootView = rootView;
    
    // LIsten for java script errors and attach the view, otherwise, it would be problematic to debug
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(jsLoadError:) name:RCTJavaScriptDidFailToLoadNotification object:nil];
}

+ (void) jsLoadError:(NSNotification *)notification {
    [RNApp hide];
}

+ (void) hide {
    gController.view = gRootView;
}

+ (BOOL) requiresMainQueueSetup {
    return YES;
}

- (NSDictionary *)constantsToExport {
    return @{ @"moduleName": gRootView.moduleName };
}

RCT_EXPORT_METHOD(activate) {
    [RNApp hide];
}

@end
