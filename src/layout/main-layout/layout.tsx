import {Component} from "react";
import {HeaderComponent} from "../header/header-component";
import './layout.scss'

export class Layout extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            children: props.children
        }
    }

    render() {
        return (
            <>
                <div className="layout">
                    <HeaderComponent/>
                    <main>
                        {this.state.children}
                    </main>
                </div>
            </>
        )
    }
}