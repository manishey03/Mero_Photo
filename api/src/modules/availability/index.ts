import AvailabilityModel from './model/availability.model';

//
import AvailabilityService from './availability.service';
import AvailabilityBusiness from './availability.business';
import AvailabilityController from './availability.controller';

//
const business = new AvailabilityBusiness();
const availabilityController = new AvailabilityController();
const availabilityService = new AvailabilityService(AvailabilityModel, business);

//
export { availabilityService, availabilityController };
