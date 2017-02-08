# Basic map flow

## Work flow

### Author creates route

* Author renders the map, finds a destination
* Author presses set route, saves to DB
  * firebase listener for `child_added` on `routes` turned **ON**
  * firebase listener for `child_removed` on `routes` turned **ON**
  * firebase listener for `child_added` on `matchedRoutes` turned **ON**

### Author requests match

* Author finds a route, presses match button
* matchedRoute is saved to the DB
  * firebase listener for `child_added` on `routes` turned **OFF**
  * firebase listener for `child_removed` on `routes` turned **OFF**
  * firebase listener for `child_added` on `matchedRoutes` turned **OFF**
  * firebase listener for `child_removed` on `matchedRoutes` turned **ON**
  * firebase listener for `child_added` on `completedMatches` turned **ON**
* Alert then pops up on Follower's screen <- at this point follower has all the same listeners as the author before requesting a match

### Follower reviews route - option A: Accept

#### Follower accepts route

* Follower hits approve button
  * firebase listener for `child_added` on `routes` turned **OFF**
  * firebase listener for `child_removed` on `routes` turned **OFF**
  * firebase listener for `child_added` on `matchedRoutes` turned **OFF**
  * firebase listener for `child_removed` on `matchedRoutes` turned **ON**
* Follower takes the matchedResult and saves it to the completedMatches data slice
* Follower waits for notice that Author has seen the event

#### Author *sees* acceptance

* Author's listener for completedMatches picks up the addition
* Author has a pop-up saying her match has been accepted, with a button to view
  * firebase listener for `child_removed` on `matchedRoutes` turned **ON**
* Author deletes the matchedRoute entry (alerting the Follower that the completedMatch was received
* Author deletes both her and the follower's route from the database
* Author is told to follow the blue line to reach the follower

#### Follower *sees* acceptance

* Given an alert that the author is incoming

### Follower reviews route - option B: Reject

#### Follower rejects route

* Follower removes matchedRoute from the database (author is alerted)
* Resets back to how things were before match requested

#### Author *sees* matchedRoute deletion

* Author gets an alert, given the choice to create a new route or keep searching
* Resets back to how things were before match requested
