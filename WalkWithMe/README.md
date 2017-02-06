## Walk With Me

Why walk alone at night or through isolated neighborhoods when there are other women walking in a similar direction?  Walk With Me is a mobile iOS application built with React Native that matches female users to each other so that they can have someone to walk home with.

### Login

![demo_login](images/demo_login.png)

Users login through Facebook oAuth to confirm their identities and gender.  Upon successful login, users are directed to a map that shows their current location.

![demo_map_home](images/demo_map_home.png)

In order to find another woman walking in a similar direction, the user must first input her end destination.

![demo_select_destination](images/demo_map_select.png)

A highlighted route will appear on the screen mapping her current location to her end destination.  If the route is correct, the user can then select "set route".

![demo_map_route](images/demo_map_routes.png)

Once a user selects "set route", the map will be updated to show other users nearby with their set routes.

![demo_map_matches](images/demo_map_matches.png)

By clicking on the matches, the user can see another user's route.  

### Technologies
  - React Native
    -react-native-maps
        -Main map screen
        -Directions via polyline rendering
    -react-native-fbsdk
        -FB OAuth
    -react-native-google-places
        -Destination search
  - Firebase
    -User authentication
    -Realtime database

### Implementation
