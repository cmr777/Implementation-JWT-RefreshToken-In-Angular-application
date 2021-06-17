import { UserService } from './../Services/user.service';

export function appInitializationService(userService: UserService) {
    return () => new Promise(resolve => {
        // attempt to refresh token on app start up to auto authenticate
        userService.refreshtoken()
            .subscribe()
            .add(resolve);
    });
}