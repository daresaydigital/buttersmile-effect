import React, {Component} from 'react'
import './header-component.scss'

type Props = {
    title?: string
}

type State = {
    title: string
}

export class HeaderComponent extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            title: props.title ?? 'Butter Smile'
        }
    }

    render() {
        return (
            <header>
                <img src="/logo192.png" alt=""/>
                <h1>{this.state.title}</h1>
            </header>
        );
    }
}