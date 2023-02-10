import { On } from 'https://esm.sh/@spec.dev/core@0.0.20'

// LensHub contract events.
export const OnLensHub = (event: string) => On(`contracts.lens.LensHubProxy.${event}`)