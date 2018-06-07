// @flow
import React, { Component, Fragment } from 'react';
import Stage from '@bhoos/stage';

type Props = {
  initialTransition: Object,
  navigator: Object,
};

class Screen extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      transition: props.initialTransition,
    };

    this.incoming = null;
    this.outgoing = null;
  }

  onMount = (stage, transition) => {
    this.incoming.onEnter(transition);
    this.props.navigator.run(transition);
  }

  onTransition = async ({ set }, transition) => {
    const { navigator } = this.props;

    const Incoming = navigator.getScreen(transition.incoming);
    const Outgoing = navigator.getScreen(transition.outgoing);

    await set({
      Outgoing,
      Incoming,
    });

    // Trigger all the events
    this.outgoing.onLeave(transition);
    this.incoming.onEnter(transition);

    // Trigger all the transitions
    await navigator.run(transition);

    // Remove the Outgoing element
    await set({
      Outgoing: null,
    });
  }

  attachIncoming = (node) => {
    if (node && node.getWrappedInstance) {
      this.incoming = node.getWrappedInstance();
    } else {
      this.incoming = node;
    }
  }

  attachOutgoing = (node) => {
    if (node && node.getWrappedInstance) {
      this.outgoing = node.getWrappedInstance();
    } else {
      this.outgoing = node;
    }
  }

  update = (transition) => {
    this.setState({
      transition,
    });
  }

  updateStage = ({ queue }, { transition }) => {
    queue(1, this.onTransition, transition);
    return null;
  }

  prepare = ({ queue }, { transition }) => {
    queue(1, this.onMount, transition);

    return {
      Incoming: this.props.navigator.getScreen(transition.incoming),
      Outgoing: null,
    };
  }

  renderStage = ({ Incoming, Outgoing }) => (
    <Fragment>
      <Incoming
        key={this.state.transition.incoming}
        ref={this.attachIncoming}
        navigator={this.props.navigator}
      />
      {Outgoing && <Outgoing
        key={this.state.transition.outgoing}
        ref={this.attachOutgoing}
        navigator={this.props.navigator}
      />}
    </Fragment>
  );

  render() {
    // const { navigator, initialScreen } = this.props;
    const { transition } = this.state;

    return (
      <Stage params={{ transition }} prepare={this.prepare} onChange={this.updateStage}>
        {this.renderStage}
      </Stage>
    );
  }
}

export default Screen;
