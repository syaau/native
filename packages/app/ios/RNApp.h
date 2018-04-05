#import <React/RCTBridgeModule.h>
#import <React/RCTRootView.h>

@interface RNApp : NSObject<RCTBridgeModule>
@property (nonatomic, strong) RCTRootView *rootView;
@property (nonatomic, strong) UIViewController *rootViewController;

+ (void)setup:(UIViewController *) controller withRootView:(RCTRootView *)rootView;
+ (void)hide;
@end
