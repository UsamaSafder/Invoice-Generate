import { Routes } from '@angular/router';
import { Main } from './main/main';
import { Home } from './home/home';

export const routes: Routes = [
    {path:'',component:Home},
    {path:'main',component:Main},
    
];
