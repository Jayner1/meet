import React from 'react';
import { shallow } from 'enzyme';
import CitySearch from '../CitySearch';

describe('<CitySearch /> component', () => {
    test('renders a list of suggestions', () => {
        const CitySearchWrapper = shallow(<CitySearch />);
        expect(CitySearchWrapper.find('.suggestions')).toHaveLength(1);
      });
});