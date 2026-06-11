export const environment = {
  production: false,
  // Local Supabase stack (`supabase start`). The hosted project still needs
  // `supabase db push` before the dev config can point back at it.
  supabase: {
    url: 'http://127.0.0.1:54321',
    key: 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH',
  },
};
