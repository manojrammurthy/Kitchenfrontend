import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const INVENTORY_API = environment.apiUrl;

const token = localStorage.getItem('accessToken');
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    })
};

export interface WorkLocation {
    id: number;
    name: string;
}

export interface KitchenLocation {
    id: number;
    name: string;
}

export interface ServingLocation {
    id: number;
    name: string;
}

@Injectable({
    providedIn: 'root'
})

export class LocationService {
    constructor(private http: HttpClient) { }

    getAllWorkLocations(): Observable<WorkLocation[]> {
        return this.http.get<WorkLocation[]>(INVENTORY_API + 'work-locations/', httpOptions);
    }

    getKitchenLocations(): Observable<KitchenLocation[]> {
        return this.http.get<KitchenLocation[]>(INVENTORY_API + 'kitchen-locations/', httpOptions);
    }

    getServingLocations(): Observable<ServingLocation[]> {
        return this.http.get<ServingLocation[]>(INVENTORY_API + 'serving-locations/', httpOptions);
    }
    getUserLocationId(): number | null {
        const currentUserString = localStorage.getItem('currentUser');
        console.log("loc current",currentUserString)
        if (!currentUserString) {
            console.warn('currentUser not found in localStorage');
            return null;
        }

        try {
            const currentUser = JSON.parse(currentUserString);
            console.log("user: ", currentUser.user)
            let locationId: number | null = null;

            const userLocation = currentUser?.user?.location;

            if (userLocation) {
                if (typeof userLocation === 'object' && userLocation !== null) {
                    locationId = Number(userLocation.id);
                } else {
                    locationId = Number(userLocation);
                }
            }

            if (locationId && !isNaN(locationId)) {
                return locationId;
            } else {
                console.warn('User location id is not valid:', locationId);
                return null;
            }
        } catch (e) {
            console.error('Error parsing currentUser from localStorage:', e);
            return null;
        }
    }

}