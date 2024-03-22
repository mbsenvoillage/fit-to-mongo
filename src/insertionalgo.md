V1

# INIT

- assign decoded config json to configjson
- assign decoded fit file to fitfile
- to keep track of insertion ids, declare an insertionTracker object with messagetypes from configjson as keys, and null as values (will be filled with ObjectID)
- assign counter the value of the number of keys in configjson

# MAIN

- while counter >= 0
  - for each key in insertionTracker :
    - if it maps to a null value
      - if configjson[key] references a collection :
        - if key maps to a value that is not null in insertionTracker :
          - build document to be inserted
          - insert it
          - store object id in corresponding key of insertionTracker
        - else :
          - continue
      - else :
        - build document to be inserted
        - insert it
        - store object id in corresponding key of insertionTracker
      - decrement counter
    - else :
      - continue

V2

# INIT

1. Prepare Data Structures:

- configjson: Load and parse the configuration JSON.
- fitfileData: Load the decoded FIT file data.
- insertionTasks: Prepare a list of all insertion tasks, each tagged with its dependencies.
- insertionQueue: Initialize as empty. This will hold tasks ready for insertion.
- waitingTasks: Initialize as empty. This will temporarily hold tasks waiting for dependency resolution.
- insertionTracker: An object to track the \_ids of inserted documents, keyed by their messageType

# PROCESSING LOOP

2. Initial Queue Population:

- Populate insertionQueue with tasks from insertionTasks that have no dependencies.

2. Process Insertion Queue:

- While there are tasks in insertionQueue:
  - Dequeue and attempt to process a task.
  - For each task, check if dependencies are met by looking up insertionTracker.
    - If all dependencies are met, proceed to insert the document into MongoDB, update insertionTracker with the new \_id, and check waitingTasks for any tasks that are now eligible for insertion (move them to insertionQueue).
    - If dependencies are not met, move the task to waitingTasks.

3. Handle Waiting Tasks:

- After processing available tasks in insertionQueue, if waitingTasks is not empty, move all tasks from waitingTasks back to insertionQueue. This cycle ensures tasks with unmet dependencies are retried.
- Implement a mechanism to prevent infinite loops for tasks whose dependencies can never be met (e.g., due to missing data or circular dependencies). This could involve tracking the number of attempts for each task and setting a maximum retry limit.

4. Repeat Processing:

- Repeat the process of attempting to insert tasks from insertionQueue and moving unresolved tasks to waitingTasks until either all tasks are processed or no progress can be made due to unresolvable dependencies.

# COMPLETION AND CLEANUP

Final Checks and Cleanup:
Perform a final check for any tasks remaining in waitingTasks. Handle them according to your application's logic (e.g., log warnings, attempt insertion with default values, etc.).
Perform any necessary cleanup, such as closing database connections.
