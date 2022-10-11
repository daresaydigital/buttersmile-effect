import {HomePage} from "../pages/home/home-page";
import {AboutPage} from "../pages/about/about-page";

export const routes: { path: string, component: any }[] = [
    {
        path: '/',
        component: HomePage
    },
    {
        path: '/about',
        component: AboutPage
    }
]