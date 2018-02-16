
- Per type init functions. Should take as parammeters the node and the
  extend function.
- Add an onChange event
- The extend is a curried funciton, so we can fire onChange. that
  extend might need the node path and possibly some information about
  the type or something. Maybe `on init` or `server result` or `on
  update`.

3.0.0

- Renaming the `mutate` action to be `update`.
