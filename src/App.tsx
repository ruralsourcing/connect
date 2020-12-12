import React from 'react';
import { hot } from 'react-hot-loader/root';

interface State {
    isError: boolean;
}

class App extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            isError: false,
        };
    }

    componentDidCatch(): void {
        this.setState({ isError: true });
    }

    render() {
        const { isError } = this.state;
        const app = isError ? <div>There was an error</div> : <>
            <h1>CASpr</h1>
        </>;
        return app;
    }
}

export default hot(App);