# Security Spec

## Data Invariants
1. A ScoreSubmission can be created by anonymous users (or authenticated users).
2. All fields in ScoreSubmission must be present and correctly typed.
3. String fields (school, classNo, seatNo) must be reasonably bounded in size.
4. Score fields must be numbers.
5. createdAt must be the server timestamp.

## The "Dirty Dozen" Payloads
1. Missing school.
2. Missing classNo.
3. Missing seatNo.
4. Invalid type for learningScore (string).
5. Additional ghost field.
6. Oversized school name (> 100 chars).
7. Client-provided timestamp instead of server timestamp.
8. Trying to update an existing submission (updates not allowed).
9. Trying to delete a submission.
10. Listing all submissions (only admin should read list, or nobody for now).
11. Reading a specific submission (no reads).
12. Creating with non-number totalScore.
