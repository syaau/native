# React Stage
Update your component with controlled stages.

We normally get the entire screen state at once, and worse even when
multiple actions are being dispatched on redux, react could batch all
setState and create a single state rather than multiple renders. When
dealing with UI, we need to batch certain actions, may be one animation
after another. The React Stage library helps solve this problem by
breaking down your state and/or props into multiple stages.

## Principal
* Create a new `params` object as per your requirement - may be from
  `props` or `state` or a combination of both, that is needed to render
  your component.
* On every params change, divide the operations into multiple stages
  queue an action using a global queue manager to run the operations
  one after another (or parallel).

## Installation
> `$ yarn add @bhoos/stage`  
  or  
> `$ npm install @bhoos/stage`

## Usage
```javascript
import Stage from '@bhoos/stage'

class StagedComponent extends Component {
  onP1 = async (stage, p1) => {
    // Update the component updating p1 only
    await set({ p1 });

    // Run an animation if needed

  }

  onP2 = async (stage, p2) => {
    ....
  }

  onS1 = async (stage, s1) => {
    ...
  }

  updateStage = (stage, { p1, p2, s1 }, prevParams) {
    if (p1 !== prevParams.p1) {
      stage.queue(1, this.onP1);
    }

    if (p2 !== prevParams.p2) {
      stage.queue(2, this.onP2);
    }

    if (s1 !== prevParams.s1) {
      stage.queue(3, this.onS1);
    }

    // Do not update the stage on change
    return null;
  }

  prepare = (stage, { p1, p2, s1 }) => {
    // You can defer the process even on initial mount
    // if needed, just return the initial stage that 
    // you need
    stage.queue(1, this.onP1, p1);
    stage.queue(2, this.onP2, p2);
    stage.queue(3, this.onS1, s1);


    return {}; 
  }

  // Render your component based on stage params
  // Keep in mind that the values of the stage params
  // are fully controllable via onChange and actions
  renderStage = ({ p1, p2, s1 }) => (
    return (
      <Fragment>
        <div>{p1}</div>
        <div>{p2}</div>
        <div>{s1}</div>
      </Fragment>
    );
  );

  render() {
    const { p1, p2 } = this.props;
    const { s1 } = this.state;

    return (
      <Stage params={p1, p2, s1} prepare={this.prepare} onChange={this.updateStage}>
        {this.renderStage}
      </Stage>
    );
  }
}
```

## Transition Demo
Its very easy to run an animation while mounting, but when the component is
unmounting it's not quite as easy.

```javascript
type Props = {
  Screen: function,
};

class Transition extends Component {

  onHide = (stage, Screen) => {
    // Run hide animation on the Outoing screen,
    await hideScreen();
    // You could also use a ref on the Outgoing component and run 
    // a hide animation right through it
    await this.outgoing.hide();

    // once the hiding is complete, remove the component, we don't
    // want the invisible component using the memory
    await stage.set({ Outgoing: null });
  }

  onShow = (stage, Screen) => {
    await showScreen();
  }

  updateStage = (stage, { Screen }, prev) => {
    // it's not necessary to check for change with prev params here
    // as thre is only one param, and updateStage is called only when
    // the params change
    // Hide the outgoing screen and show the incoming screen, you could
    // run both the animation at the same time, by giving them the same
    // order
    stage.queue(1, this.onHide, prev.Screen);
    stage.queue(1, this.onShow, Screen);
    return {
      Incoming: Screen,
      Outgoing: prev.Screen,
    };
  }

  prepare = (stage, { Screen }) => {
    // Divide screen into incoming and outgoing
    stage.queue(1, this.onShow, Screen);

    return {
      Incoming: Screen,
      Outgoing: null,
    };
  }

  renderStage = ({ Incoming, Outoing }) => (
    return (
      <Fragment>
        <Incoming ref={this.incoming} />
        {Outoing && <Outgoing ref={this.outgoing} />}
      </Fragment>
    );
  )

  render() {
    const { Screen } = this.props;
    return (
      <Stage params={Screen} prepare={this.prepare} onChange={this.updateStage}>
       { this.renderStage }
      </Stage>
    );
  }
}

