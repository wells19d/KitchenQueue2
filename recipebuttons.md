# Recipe Header Logic Outline

This document defines the button layout and behaviors for both **Recipe Box** and **Recipe Search** headers.  
It also explains what each button does and which Author roles can access them.

---

## Overview

There are two header types:

1. **Recipe Box Header** — for managing a Author’s own recipes.
2. **Recipe Search Header** — for exploring community recipes.

Each header will display different buttons and actions depending on:

- **User type** (Admin / Author / User)
- **Recipe state** (`recipeShared`, `authorID`, etc.)

---

## Roles

### Admins

- Admins can **edit or delete any recipe**, regardless of ownership. (In recipe search. Admins won't directly look at anyone's private recipe unless for some reason the systems "protection system" detects a violation).
- (The protection system is not built and will be a future feature)
- The Admin features will be added **last**, since it can interfere with normal Author flows.
- Admin-only actions will likely live under a **shield** button.

### Authors

- Authors are identified via `authorID` matching the user's `profileID`.  
  _(Names cannot be used to claim authorship.)_
- Authors can **share** their recipes from their Recipe Box to the community.
- Once shared, a recipe becomes **community property** and can no longer be directly edited or deleted by the Author.
- If multiple users exist on one Author account, they may also make changes if permitted.
- If an Author deletes or leaves their account, their profile will be **archived**, not deleted.  
  This allows restoration of ownership if they later return.

---

### Users

- Users are everyone else who can view or interact with community recipes.
- They can **bookmark** or **save** community recipes to their own Recipe Box, but cannot modify or remove them.

---

## Author Actions and Flow

### 1. Sharing a Recipe

When a Author taps **Share Recipe**:

1. Show a **confirmation alert**:

   - Warn: “Once shared, this recipe becomes community property and can no longer be edited or deleted directly.”
   - Explain that future edits/deletes require admin review to prevent sabotage or regret-driven removals.

2. If the Author accepts:
   - Set `recipeShared = true` in Firestore.
   - Remove **Edit** and **Delete** buttons for this recipe.
   - Replace them with **Author Requests**.

---

### 2. Author Requests (for Shared Recipes)

When `recipeShared === true`, the Author sees two buttons under **Author Requests**:

#### **Request Edit**

- Opens a form with **buildable fields** where the Author can:
  - Indicate **which section** of the recipe they want to modify (ingredients, instructions, notes, etc.).
  - Provide **the new content or correction**.
- Authors can add **multiple change requests** before submitting.
- Submitting creates a message or record for **admin review**.

#### **Request Delete**

- Opens a form with a **dropdown list of reasons**, including:
  - “Recipe is a duplicate.”
  - “Recipe contains major errors.”
  - “Recipe was shared by mistake.”
  - “Original owner changed their mind.”
- The Author will see a note:

  > “Delete requests are reviewed and may only be honored if valid.”

- If the reason is “Shared by mistake,” a timestamp check is run:
  - Request only honored if within **72 hours** of original sharing.

---

## Example Header Layouts

### Recipe Box Header

(deciding buttons still)

### Recipe Search Header

(deciding buttons still)

---

## Notes / Future Features

- Add **Admin Review Panel** (web version first).
- Consider **notifications** for when Author requests are approved/denied.
- Recipe edit requests should be **batched by recipe ID** for easy review.
- Add **“reason required”** validation for all delete requests.

---

## Timeline Suggestion

1. Implement Author-side share flow (`recipeShared` flag + UI toggle).
2. Add “Author Requests” logic for shared recipes.
3. Build admin review structure for requests.
4. Integrate admin permissions into headers.
5. Final polish: notifications, filters, and community moderation tools.

---
