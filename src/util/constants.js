import Immutable from 'immutable';

export const  defaultData = Immutable.Map({
    loading: false,
    loaded: false,
    data: null,
    error: null
});

export const defaultErrorMsg = {
    network: 'network error!',
    system: 'system error!'
}

