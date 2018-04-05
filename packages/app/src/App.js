// @flow
import { Component } from 'react';
import { NativeModules, AppRegistry } from 'react-native';

export function addLinkHandler(handler) {
  return handler;
}

export function render(element, moduleName?: string) {
  class AppRoot extends Component {
    constructor(props) {
      super(props);

      // The element could be a React element or a function that returns a element or a Promise that
      // resolves to an element
      const elementToRender = typeof element === 'function' ? element() : element;

      // If it's a promise, wait until the promise resolves
      if (elementToRender instanceof Promise) {
        elementToRender.then((finalElement) => {
          this.setState({
            element: finalElement,
          });
        });

        this.state = { element: null };
      } else {
        this.state = { element: elementToRender };
      }
    }

    componentDidMount() {
      // If the rendering was direct, just activate the main app
      // which removes the splash screen
      if (this.state.element !== null) {
        NativeModules.RNApp.activate();
      }
    }

    componentDidUpdate() {
      // If the component was rendered later, activate the main app
      // which hides the splash screen
      NativeModules.RNApp.activate();
    }

    render() {
      return this.state.element;
    }
  }


  const module = moduleName || NativeModules.RNApp.moduleName || 'RNApp';

  // Register the component to run with the App
  AppRegistry.registerComponent(module, () => AppRoot);
}
