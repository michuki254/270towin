import { getStateOfficials } from '$lib/data/stateOfficials';

export function load({ params }) {
	return {
		state: getStateOfficials(params.state)
	};
}
