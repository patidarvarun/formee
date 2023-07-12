import React, { Suspense } from "react";
import { Route, Switch, Redirect } from "react-router";
import { langs } from "../config/localization";
import { connect } from "react-redux";
import AuthMiddleware from "../AuthMiddleware";
import PageNotFound from "../common/NotFoundPage";
import UnAuthorized from "../common/UnAuthorizedAcess";
import WelComePage from "../components/layout";
import ScrollToTop from "../components/common/ScrollToTop";
import { Loader } from "../components/common/Loader";
import SignUp from "../components/auth/registration";
import EditProfile from "../components/vendor/classified/classified-vendor-profile-setup";
import ResetPasswordPage from "../components/auth/ResetPasswordModal";
import VendorEditProfile from "../components/dashboard/vendor-profiles/common-profile-setup";
import MyProfile from "../components/vendor/classified/classified-vendor-profile-setup/Myprofile";
import Message from "../components/dashboard/message/message";
import MapView from "../components/common/MapView";
import SeeMore from "../components/classified-templates/automative/SeeMore";
import JobsSeeMore from "../components/classified-templates/jobs/SeeMore";
import CommonFilter from "../components/common/Filter";
import SimpleLandingPage from "../components/classified-templates/automative";
import JobLandingPage from "../components/classified-templates/jobs";
import Template1DetailPage from "../components/classified-templates/automative/Details";
import JobsDetailPage from "../components/classified-templates/jobs/Detail";
import Template3DetailPage from "../components/classified-templates/real-state/Details";
import InterMediateStep from "../components/auth/intermediate-step";
import ChangePassword from "../components/auth/ChangePassword";
import Dashboard from "../components/dashboard";

import MyAds from "../components/vendor/MyAds";

import JobApplicationList from "../components/vendor/classified/employer-vendor/JobApplicationList";
import ApplicationDetails from "../components/vendor/classified/employer-vendor/ApplicationDetails";

import BookingLandingPage from "../components/booking";
import HandyManLandingPage from "../components/booking/handy-man";
import PServicesLandingPage from "../components/booking/professional-services";
import HandyManSubCategoryPage from "../components/booking/handy-man/SubCatgory";
import HandyDetailPage from "../components/booking/handy-man/Details";
import HandyManSeeMorePage from "../components/booking/handy-man/SeeMore";

import BookingSubcategorySeeMorePage from "../components/booking/beauty/SeeMore";
import BookingMapView from "../components/booking/handy-man/MapView";
import RestaurantMapView from "../components/booking/restaurent/MapView";

import BeautyLandingPage from "../components/booking/beauty";
import BeautySubCategoryPage from "../components/booking/beauty/SubCategory";
import BeautySearchPage from "../components/booking/beauty/SearchView";
import SportsSearchPage from "../components/booking/sports/SearchView";
import RestaurantSearchPage from "../components/booking/restaurent/SearchView";
import SportsLandingPage from "../components/booking/sports";

import EventsLandingPage from "../components/booking/events";
import WellBeingLandingPage from "../components/booking/wellbeing";
import RestaurentLandingPage from "../components/booking/restaurent";

import ClassifiedsLandingPage from "../components/classified-templates";
import SimpleSubCategory from "../components/classified-templates/real-state/SubCategory";
//import BookingLandingPage1 from '../components/classified-templates/booking/LandingPage'

import RestaurantDetailPage from "../components/booking/restaurent/RestaurantDetails";
import RestaurantReviewsPage from "../components/booking/restaurent/RestaurantReviews";
import SportsDetailPage from "../components/booking/sports/SportsDetailsPage";

import PopularEventSeeMorePage from "../components/booking/common/PopularSeeAll";
import BookingMapDetailView from "../components/booking/common/MapDetailView";
import PopularSportsSeeAll from "../components/booking/sports/PopularSportsSeeAll";
import TicketListing from "../components/booking/sports/TicketListing";
import PromoSeeAll from "../components/booking/common/PromoSeeAll";

// Profile Routes Import
import EventCatereEditProfile from "../components/dashboard/vendor-profiles/common-profile-setup/index";
import EventCatereMyProfile from "../components/dashboard/vendor-profiles/MyProfile";
import FitnessMyProfileSetup from "../components/dashboard/vendor-profiles/fitness/manage-class/Listing";
import FitnessEditClass from "../components/dashboard/vendor-profiles/fitness/manage-class/EditClass";
import FitnessVenderMyBookings from "../components/dashboard/vendor-profiles/fitness/my-bookings";
import HandymanVenderMyBookings from "../components/dashboard/vendor-profiles/handyman/my-bookings/index";
import EventVenderMyBookings from "../components/dashboard/vendor-profiles/event-caterer/my-bookings/index";

// import BookingListingpagePage from '../components/classified-templates/booking/ListingPage'
// import BookingListingpageList from '../components/classified-templates/booking/ListingPageList'
// import BookingListDetails from '../components/classified-templates/booking/ListingDetailsPage'
import "react-redux-toastr/lib/css/react-redux-toastr.min.css";
import history from "../common/History";
import PostAd from "../components/classified-post-ad";
import RetailPostAd from "../components/retail-post-ad";
import UpdatePostAnAd from "../components/classified-post-ad/update-post-ad/EditPost";
import PopularViewSeeAll from "../components/classified-templates/SeeAll";
import MapViewDetail from "../components/common/MapDetailView";
import ResumeBuilder from "../components/classified-templates/jobs/resume-builder";

//Profile
import BeautyServiceList from "../components/dashboard/vendor-profiles/beauty/Listing";
import UpdateBeautyService from "../components/dashboard/vendor-profiles/beauty/CreateBeautyService";
import UpdateServive from "../components/dashboard/vendor-profiles/beauty/UpdateBeautyService";
import RestaurantMenu from "../components/dashboard/vendor-profiles/restaurant/RestaurantMenu";
import UpdateRestaurantMenu from "../components/dashboard/vendor-profiles/restaurant/UpdateMenu";
import AddRestaurantMenu from "../components/dashboard/vendor-profiles/restaurant/AddMenu";
import SpaServices from "../components/dashboard/vendor-profiles/spa/SpaServiceList";
import UpdateSpaServices from "../components/dashboard/vendor-profiles/spa/UpdateSpaService";
import AddServices from "../components/dashboard/vendor-profiles/spa/AddServices";
import CreateDeals from "../components/dashboard/vendor-profiles/daily-deals/index";
import MyDeals from "../components/dashboard/vendor-profiles/daily-deals/Listing";
import MyPromotions from "../components/dashboard/vendor-profiles/promotions/Listing";
import CreatePromotions from "../components/dashboard/vendor-profiles/promotions";
import MySpecialOffers from "../components/dashboard/vendor-profiles/special-offers/Listing";
import CreateOffers from "../components/dashboard/vendor-profiles/special-offers";
import MyBestPacakges from "../components/dashboard/vendor-profiles/best-packages/Listing";
import CreateBestPackages from "../components/dashboard/vendor-profiles/best-packages";

//Classified Vender Routes
import GeneralVendorMyOffer from "../components/vendor/classified/general/OfferList";
import GeneralVendorMyOfferDetail from "../components/vendor/classified/general/OfferDetails";
import InspectionList from "../components/vendor/classified/real-state/InspectionList";
import InspectionDetails from "../components/vendor/classified/real-state/InspectionDetails";
import BookingDashboard from "../components/dashboard/BookingDashboard";

//m4 retail module routes
import RetailLandingPage from "../components/retail";
import RetailCatLandingPage from "../components/retail/retail-categories/LandingPage";
import RetailSubCategoryPage from "../components/retail/retail-categories/SubCatgory";
import RetailDetailPage from "../components/retail/retail-categories/Details";
import RetailSeeMore from "../components/retail/retail-categories/SeeMore";
import RetailFilterPage from "../components/retail/Filter";

//m4 retail vendor routes
import VendorRetailEditProfile from "../components/vendor/retail/vendor-profile-setup/index";
import ReceivedOrder from "../components/vendor/retail/ReceivedOrder";
import VendorRetailDashboard from "../components/vendor/retail/index";
import VendorTransaction from "../components/vendor/retail/Transaction";
// import UpdateRetailPostAnAd from '../components/dashboard/vendor-profiles/event-caterer/my-ads/RetailEditPost'
import UpdateRetailPostAnAd from "../components/retail-post-ad/RetailEditPost";
import RetailPaymentScreen from "../components/vendor/retail/vendor-profile-setup/RetailPayment";
import RetailDailyDeals from "../components/vendor/retail/daily-deals";
import RetailDailyDealsList from "../components/vendor/retail/daily-deals/Listing";

//m4 retail module routes ui
import VendorRetailInvoice from "../components/vendor/retail/viewinvoice";
import UserRetailDashboard from "../components/retail/user-retail/index";
import UserRetailCartDetail from "../components/retail/retail-cart/Retailcart";

// dashboard-classified
import UserClassifiedsDashboard from "../components/classified-templates/user-classified/index.js";
// food scanner
import FoodScannerLandingPage from "../components/food-scanner/index";

import FoundUserAds from "../components/classified-templates/FoundAds";

import MyBookings from "../components/dashboard/my-profile/spa";
import CustomerSpaBookingDetails from "../components/dashboard/my-profile/spa/CustomerSpaBookingDetails";
import CustomerSpaBookingHistoryDetails from "../components/dashboard/my-profile/spa/CustomerSpaBookingHistoryDetails";
import VendorMyBookingsSpa from "../components/dashboard/vendor-profiles/spa/my-bookings/spa";
import VendorSpaBookingDetails from "../components/dashboard/vendor-profiles/spa/my-bookings/spa/VendorSpaBookingDetails";
import VendorSpaMyBookingCalender from "../components/dashboard/vendor-profiles/spa/my-bookings/spa/VendorSpaMyBookingCalender";
import VendorSpaBookingHistoryDetails from "../components/dashboard/vendor-profiles/spa/my-bookings/spa/VendorSpaBookingHistoryDetails";

// Customer Restaurant Orders
import MyRestaurantOrders from "../components/dashboard/my-profile/restaurant/my-orders";
import TrackUserRestaurantOrders from "../components/dashboard/my-profile/restaurant/my-orders/TrackUserRestaurantOrders";

// Retails orders
import MyRetailOrders from "../components/dashboard/my-profile/restaurant/my-orders/Retailindex";


// Vendor Restaurant Dashboard
import RestaurantVendorDashboard from "../components/dashboard/vendor-profiles/restaurant/my-bookings/RestaurantVendorDashboard";
// Vendor Restaurant Dashboard
import RestaurantVendorOrderList from "../components/dashboard/vendor-profiles/restaurant/my-bookings/RestaurantVendorOrdersList";

// User My Booking Beauty
import CustomerMyBookingsBeauty from "../components/dashboard/my-profile/beauty/my-booking";
import CustomerBeautyBookingDetails from "../components/dashboard/my-profile/beauty/my-booking/CustomerBeautyBookingDetails";
import CustomerBeautyBookingHistoryDetails from "../components/dashboard/my-profile/beauty/my-booking/CustomerBeautyBookingHistoryDetails";

//Vendor Beauty booking
import VendorMyBookingsBeauty from "../components/dashboard/vendor-profiles/beauty/my-bookings/beauty";
import VendorBeautyBookingDetails from "../components/dashboard/vendor-profiles/beauty/my-bookings/beauty/VendorBeautyBookingDetails";
import VendorBeautyMyBookingCalender from "../components/dashboard/vendor-profiles/beauty/my-bookings/beauty/VendorBeautyMyBookingCalender";
import VendorBeautyBookingHistoryDetails from "../components/dashboard/vendor-profiles/beauty/my-bookings/beauty/VendorBeautyBookingHistoryDetails";

// Fitness Vendor Mange calendar
import FitnessVenderMyCalendar from "../components/dashboard/vendor-profiles/fitness/manage-calendar";

//Schedule
import MembershipList from "../components/booking/wellbeing/fitness/MembershipList";
import Schedule from "../components/booking/wellbeing/fitness/view-schedule";
import Classes from "../components/booking/wellbeing/fitness/view-classes";

import BookingCheckout from "../components/booking/checkout";
import RestaurentCheckout from "../components/booking/checkout/RestaurentCheckout";
// handyman checkout success page
import HandymanBookingCheckoutSuccess from "../components/dashboard/my-profile/handyman/handymanBookingDetails.js";
// handyman checkout success page

import CustomerMyBookings from "../components/dashboard/my-profile/MyBookings";

//handyman
import HandyManDashboard from "../components/dashboard/vendor-profiles/handyman/my-bookings/dashboard";
/**UI */

// my event bookings
//import 
import MyEventBooking from "../components/dashboard/my-profile/event/my-booking/";
import MyEventBookingDetails from "../components/dashboard/my-profile/event/my-booking/EventBookingDetails";
import handymanBookingDetails from "../components/dashboard/my-profile/handyman/handymanBookingDetails";

import EventVendorCaterer from "../components/dashboard/my-profile/vendor/event-vendor-caterer/";
import ProfileVendorHandyman from "../components/dashboard/my-profile/vendor/profile-vendor-handyman/";
import ProfileVendorBeauty from "../components/dashboard/my-profile/vendor/profile-vendor-beauty/";
import ProfileVendorRestaurant from "../components/dashboard/my-profile/vendor/profile-vendor-restaurant";
import ProfileVendorFitness from "../components/dashboard/my-profile/vendor/fitness-vendor-profile/";

/**Restaurant Cart */

import RestaurantCartDetail from "../components/booking/restaurent/restaurant-cart/RestaurantCartDetail";
import FitnessVendorDashboard from "../components/dashboard/vendor-profiles/fitness/dashboard/FitnessVendorDashboard";
import CustomerFitnessBookingDetails from "../components/dashboard/my-profile/fitness/my-bookings/CustomerFitnessBookingDetails";
import CustomerFitnessBookingHistoryDetails from "../components/dashboard/my-profile/fitness/my-bookings/CustomerFitnessBookingHistoryDetails";
import RestaurantOrderDetail from "../components/dashboard/my-profile/restaurant/my-orders/orderdetail";
import RestaurantPastOrderDetail from "../components/dashboard/my-profile/restaurant/my-orders/RestaurantPastOrderDetail";
import OrderDetailsInvoice from "../components/dashboard/my-profile/restaurant/my-orders/OrderDetailsInvoice";
import EventVendorDashboard from "../components/dashboard/vendor-profiles/event-caterer/dashboard/EventVendorDashboard";
import FoodProductDetailPage from "../components/food-scanner/FoodProductDetailPage";
import AddProduct from "../components/food-scanner/AddProduct";
import SeeAllProducts from "../components/food-scanner/SeAllProduct";
import CompareFoodProduct from "../components/food-scanner/CompareProduct";
import AboutUs from "../components/footer/StaticPages";
import StaticPages from "../components/footer/StaticPages";
import MobileAppScreen from "../components/footer/MobileAppStaticScreen";
import ContactPages from "../components/footer/ContactStatic";

import FAQPage from "../components/footer/FAQPage";

import UserDashboard from "../components/dashboard/my-profile/user-dashboard";
import UserNotification from "../components/dashboard/my-profile/user-dashboard/UserNotification";
import UserWishlist from "../components/dashboard/my-profile/user-dashboard/UserWishlist";
import TestCard from "../components/TestCard";

import UserReview from "../components/dashboard/my-profile/user-dashboard/UserReview";
import Review from "../components/dashboard/vendor-profiles/VendorReviews";
import SellerFeedback from "../components/vendor/retail/vendor-reviews/SellerFeedback";
import RetailProductReview from "../components/vendor/retail/vendor-reviews/ProductReviewList";

// Retail Checkout Page UI
import RetailCheckout from "../components/retail/retail-categories/checkout-process/RetailCheckout";

// Retail Checkout Order Summary Page UI
import CheckoutOrderSummary from "../components/retail/retail-categories/checkout-process/CheckoutOrderSummary";

//* Retail Payment Complete Page UI */
import PaymentComplete from "../components/retail/retail-categories/checkout-process/PaymentComplete";

import RetailCheckoutProcess from "../components/retail/retail-categories/checkout-process/index";
import RestaurantPaymentComplete from "../components/booking/restaurent/restaurant-cart/PaymentComplete";

//* Retail Payment Method Page */
import PaymentMethods from "../components/dashboard/vendor-profiles/vendor-payment/PaymentMethods";
import EditPaymentMethods from "../components/dashboard/vendor-profiles/vendor-payment/EditPaymentMethods";
import AddPaymentMethods from "../components/dashboard/vendor-profiles/vendor-payment/AddpaymentMethod";

//* Profile Payment Method Page */
import ProfilePaymentMethods from "../components/vendor/classified/classified-vendor-profile-setup/PaymentMethods";
import ProfileEditPaymentMethods from "../components/vendor/classified/classified-vendor-profile-setup/EditPaymentMethods";
import ProfileAddPaymentMethods from "../components/vendor/classified/classified-vendor-profile-setup/AddpaymentMethod";

//* Tourism Page */
import TourismLandingPage from "../components/booking/tourism";
import FlightLandingPage from "../components/booking/tourism/flight";
import CarLandingPage from "../components/booking/tourism/car";
import FlightList from "../components/booking/tourism/flight/ListPage";
import CarList from "../components/booking/tourism/car/CarList";
import CarMapView from "../components/booking/tourism/car/MapView";
import FlightBookings from "../components/booking/tourism/flight/flight-bookings";
import TourismSeeAll from "../components/booking/tourism/SeeAll";
// import OneWayReturn from "../components/booking/tourism/flight/flight-bookings/OneWayReturn";
// import BookingForm from "../components/booking/tourism/flight/flight-bookings/BookingForm";
// import FlightCheckout from "../components/booking/tourism/flight/flight-bookings/FlightCheckout";

import CarDetails from "../components/booking/tourism/car/car-checkout";
import CarBookingForm from "../components/booking/tourism/car/car-checkout/CarBookingForm";
import CarCheckout from "../components/booking/tourism/car/car-checkout/CarCheckout";

import HotelLandingPage from "../components/booking/tourism/hotel";
import HotelDetails from "../components/booking/tourism/hotel/hotel-checkout/HotelDetails";
//import HotelDetails from "../components/booking/tourism/hotel/hotel-checkout/HotelDescription";
import HotelBookingForm from "../components/booking/tourism/hotel/hotel-checkout/HotelBookingForm";
import HotelCheckout from "../components/booking/tourism/hotel/hotel-checkout/HotelCheckout";
import HotelSearchList from "../components/booking/tourism/hotel/HotelList";
import HotelMapView from "../components/booking/tourism/hotel/MapView";

import BookingCalendarView from "../components/dashboard/vendor-profiles/event-caterer/my-bookings/BookingsCalenderView";
import TicketDetails from "../components/booking/sports/TicketDetails";
import OrderTracking from "../components/dashboard/vendor-profiles/restaurant/OrderTracking";
import TicketDetailForm from "../components/booking/sports/TicketDetailForm";
import TicketBooking from "../components/booking/sports/TicketBooking";

import RetailPaymentComplete from "../components/dashboard/my-profile/PaymentComplete";
import MostBooked from "../components/booking/tourism/hotel/MostBooked";


class Routes extends React.Component {
  render() {
    const { isLoggedIn, isPrivateUser, menuSkiped, loggedInUser } = this.props;
    let showDeals = false,
      realStateVendor = "",
      merchant = "";
    let showPackages = false;
    if (loggedInUser) {
      showDeals =
        loggedInUser.user_type === langs.userType.fitness ||
        loggedInUser.user_type === langs.key.restaurant ||
        loggedInUser.user_type === langs.userType.beauty ||
        loggedInUser.user_type === langs.userType.wellbeing;
      showPackages =
        loggedInUser.user_type === langs.key.restaurant ||
        loggedInUser.user_type === langs.userType.wellbeing ||
        loggedInUser.user_type === langs.userType.beauty;
      merchant = loggedInUser.role_slug === langs.key.merchant;

      realStateVendor =
        loggedInUser.user_type === langs.key.business &&
        loggedInUser.role_slug === langs.key.real_estate;
    }
    return (
      <Suspense fallback={<Loader />}>
        <ScrollToTop />
        <Switch>
          {(!isLoggedIn || isPrivateUser) && (
            <Switch>
              <Route
                history={history}
                exact
                path="/test-checkout"
                component={TestCard}
              />

               <Route
                history={history}
                exact
                path="/my-orders/restaurant-order-detail"
                component={RestaurantOrderDetail}
              />
               <Route
                history={history}
                exact
                path="/my-orders/restaurant-PastOrder-detail"
                component={RestaurantPastOrderDetail}
              />
               <Route
                history={history}
                exact
                path="/my-orders/restaurant-order-detail-invoice"
                component={OrderDetailsInvoice}
              />
              


              {/* <Route history={history} exact path='/signup' component={SignUp} /> */}
              <Route
                history={history}
                exact
                path="/my-booking/event"
                component={MyEventBooking}
              />
              <Route
                history={history}
                exact
                path="/event-vendor-caterer/event-vendor"
                component={EventVendorCaterer}
              />
              <Route
                history={history}
                exact
                path="/profile-vendor-handyman/vendor-handyman"
                component={ProfileVendorHandyman}
              />
              <Route
                history={history}
                exact
                path="/profile-vendor-beauty/vendor-beauty"
                component={ProfileVendorBeauty}
              />
              <Route
                history={history}
                exact
                path="/profile-vendor-restaurant/vendor-restaurant"
                component={ProfileVendorRestaurant}
              />
              <Route
                history={history}
                exact
                path="/profile-vendor-fitness/fitness-vendor"
                component={ProfileVendorFitness}
              />

              <Route history={history} exact path="/" component={WelComePage} />
              <Route
                history={history}
                exact
                path="/classifieds"
                component={ClassifiedsLandingPage}
              />
              <Route
                history={history}
                exact
                path="/classifieds/:tab_type/:filter"
                component={ClassifiedsLandingPage}
              />
              <Route
                history={history}
                exact
                path="/bookings"
                component={BookingLandingPage}
              />
              <Route
                history={history}
                exact
                path="/bookings/:filter"
                component={BookingLandingPage}
              />

              <Route
                history={history}
                exact
                path="/change-password"
                component={AuthMiddleware(ChangePassword)}
              />
              <Route
                history={history}
                exact
                path="/editProfile"
                component={AuthMiddleware(EditProfile)}
              />
              <Route
                history={history}
                exact
                path="/myProfile"
                component={AuthMiddleware(MyProfile)}
              />

              <Route
                history={history}
                exact
                path="/edit-profile-payment-methods/:id"
                component={ProfileEditPaymentMethods}
              />

              <Route
                history={history}
                exact
                path="/add-profile-payment-methods"
                component={ProfileAddPaymentMethods}
              />

              <Route
                history={history}
                exact
                path="/message"
                component={AuthMiddleware(Message)}
              />

              {merchant ? (
                <Route
                  history={history}
                  exact
                  path="/post-an-ad"
                  component={RetailPostAd}
                />
              ) : (
                <Route
                  history={history}
                  exact
                  path="/post-an-ad"
                  component={PostAd}
                />
              )}
              <Route
                history={history}
                exact
                path="/classifieds/filter/:categoryName/:categoryId/:subCategoryName/:subCategoryId"
                component={CommonFilter}
              />
              <Route
                history={history}
                exact
                path="/classifieds/filter/:all/:categoryName/:categoryId"
                component={CommonFilter}
              />
              <Route
                history={history}
                exact
                path="/see-more/popular-view/:templateName/:categoryName/:categoryId"
                component={PopularViewSeeAll}
              />

              {/* 17/02/2021 see all changes  */}
              <Route
                history={history}
                exact
                path="/see-more/popular-view/:display_type/:templateName/:categoryName/:categoryId"
                component={PopularViewSeeAll}
              />

              <Route
                history={history}
                exact
                path="/classifieds/see-more/:filter/:classified_id"
                component={SeeMore}
              />
              <Route
                history={history}
                exact
                path="/classifieds/see-more/:filter"
                component={SeeMore}
              />

              {/* 17/02/2021 see all changes  */}
              <Route
                history={history}
                exact
                path="/classifieds/see-more/:filter/:display_type/:classified_id"
                component={SeeMore}
              />

              <Route
                history={history}
                exact
                path={`/classifieds/map-view/:templateName/:categoryName/:categoryId/:subCategoryName/:subCategoryId`}
                component={MapView}
              />
              <Route
                history={history}
                exact
                path={`/classifieds/:all/map-view/:templateName/:categoryName/:categoryId/`}
                component={MapView}
              />
              <Route
                history={history}
                exact
                path={`/classifieds/map-view/:templateName/:categoryName/:categoryId/:subCategoryName/:subCategoryId/:classifiedId`}
                component={MapViewDetail}
              />

              {/* Booking Module routes */}
              <Route
                history={history}
                exact
                path="/bookings"
                component={BookingLandingPage}
              />
              <Route
                history={history}
                exact
                path="/bookings/:categoryName/:categoryId/:subCategoryName/:subCategoryId"
                component={HandyManSubCategoryPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-detail/:categoryName/:categoryId/:itemId"
                component={HandyDetailPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-detail/:filter/:categoryName/:categoryId/:subCategoryName/:subCategoryId/:itemId"
                component={HandyDetailPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-restaurant-detail/:categoryName/:categoryId/:itemId"
                component={RestaurantDetailPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-restaurant-reviews/:categoryName/:categoryId/:itemId"
                component={RestaurantReviewsPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-sports-detail/:categoryName/:categoryId/:itemId"
                component={SportsDetailPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-detail/:categoryName/:categoryId/:subCategoryName/:subCategoryId/:itemId"
                component={HandyDetailPage}
              />
              <Route
                history={history}
                exact
                path="/bookings/:all/:categoryName/:categoryId"
                component={HandyManSubCategoryPage}
              />
              {/* Booking Tourism Module routs */}
              <Route
                history={history}
                exact
                path="/booking-tourism"
                component={TourismLandingPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-flight-tourism/:categoryName/:categoryId/:subCategoryName/:subCategoryId"
                component={FlightLandingPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-car-tourism/:categoryName/:categoryId/:subCategoryName/:subCategoryId"
                component={CarLandingPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-hotel-tourism/:categoryName/:categoryId/:subCategoryName/:subCategoryId"
                component={HotelLandingPage}
              />
              <Route
                history={history}
                exact
                path="/booking-tourism-flight-listpage/:categoryName/:categoryId/:subCategoryName/:subCategoryId"
                component={FlightList}
              />
              <Route
                history={history}
                exact
                path="/booking-tourism-flight-listpage/:categoryName/:categoryId"
                component={FlightList}
              />

              <Route
                history={history}
                exact
                path="/booking-tourism-car-carlist/:categoryName/:categoryId/:subCategoryName/:subCategoryId"
                component={CarList}
              />
              <Route
                history={history}
                exact
                path="/booking-tourism-car-map-view/:categoryName/:categoryId/:subCategoryName/:subCategoryId"
                component={CarMapView}
              />

              <Route
                history={history}
                exact
                path="/booking-tourism-car-carlist/:categoryName/:categoryId"
                component={CarList}
              />
              {/* Start: Tourism-Flight-checkout-Route */}

              <Route
                history={history}
                exact
                path="/booking-tourism-flight/:filter/:counter"
                component={FlightBookings}
              />
              <Route
                history={history}
                exact
                path="/booking-tourism-see-all/:filter/:categoryId"
                component={TourismSeeAll}
              />

              <Route
                history={history}
                exact
                path="/booking-tourism-car-detail/:id"
                component={CarDetails}
              />
              <Route
                history={history}
                exact
                path="/booking-tourism-car-booking-form"
                component={CarBookingForm}
              />
              <Route
                history={history}
                exact
                path="/booking-tourism-car-checkout"
                component={CarCheckout}
              />
              {/* End: Tourism-Car-checkout-Route */}
              {/* Start: Tourism-hotel-checkout-Route */}
              <Route
                history={history}
                exact
                path="/booking-tourism-hotel"
                component={HotelLandingPage}
              />
              <Route
                history={history}
                exact
                path="/booking-tourism-hotel-detail/:code"
                component={HotelDetails}
              />
              <Route
                history={history}
                exact
                path="/booking-tourism-hotel-booking-form"
                component={HotelBookingForm}
              />
              <Route
                history={history}
                exact
                path="/booking-tourism-hotel-checkout"
                component={HotelCheckout}
              />
              <Route
                history={history}
                exact
                path="/booking-tourism-hotel-list/:categoryName/:categoryId"
                component={HotelSearchList}
              />
              <Route
                history={history}
                exact
                path="/booking-tourism-hotel-map-view/:categoryName/:categoryId"
                component={HotelMapView}
              />
              {/* End: Tourism-hotel-checkout-Route */}

              {/* Nik */}

              {/* Booking Module see more routes */}

              <Route
                history={history}
                exact
                path="/bookings-see-more/:filter/:categoryName/:categoryId"
                component={HandyManSeeMorePage}
              />
              <Route
                history={history}
                exact
                path="/bookings-see-more/:filter/:categoryName/:categoryId"
                component={BookingSubcategorySeeMorePage}
              />
              <Route
                history={history}
                exact
                path="/bookings-see-more/:filter/:categoryName/:categoryId/:subCategoryName/:subCategoryId"
                component={BookingSubcategorySeeMorePage}
              />
              <Route
                history={history}
                exact
                path="/bookings-popular-see-more/:categoryName/:categoryId/:subCategoryName/:subCategoryId"
                component={PopularEventSeeMorePage}
              />
              <Route
                history={history}
                exact
                path="/bookings-popular-see-more/:categoryName/:filter/:categoryId"
                component={PopularEventSeeMorePage}
              />
              <Route
                history={history}
                exact
                path="/bookings-popular-see-more/:categoryName/:categoryId"
                component={PopularEventSeeMorePage}
              />
              <Route
                history={history}
                exact
                path="/bookings-popular-sports-see-more/:categoryId"
                component={PopularSportsSeeAll}
              />
              <Route
                history={history}
                exact
                path="/booking-ticket-list/:id"
                component={TicketListing}
              />
              {/* <Route
                history={history}
                exact
                path="/ticket-booking"
                component={TicketBooking}
              /> */}
              <Route
                history={history}
                exact
                path="/ticket-booking"
                component={AuthMiddleware(TicketBooking)}
              />
              <Route
                history={history}
                exact
                path="/booking-ticket-detail/53"
                component={TicketDetails}
              />
              <Route
                history={history}
                exact
                path="/booking-ticket-detail-form/53"
                component={TicketDetailForm}
              />
              <Route
                history={history}
                exact
                path="/bookings-see-all/:filter/:categoryId"
                component={PromoSeeAll}
              />

              <Route
                history={history}
                exact
                path={`/bookings-map-view/:categoryName/:categoryId/:subCategoryName/:subCategoryId`}
                component={BookingMapView}
              />
              <Route
                history={history}
                exact
                path={`/booking/map-view/:categoryName/:categoryId/:subCategoryName/:subCategoryId/:itemId`}
                component={BookingMapDetailView}
              />
              <Route
                history={history}
                exact
                path={`/bookings-map-view/:categoryName/:categoryId`}
                component={BookingMapView}
              />
              <Route
                history={history}
                exact
                path={`/bookings-map-view/:all/:categoryName/:categoryId/`}
                component={BookingMapView}
              />
              <Route
                history={history}
                exact
                path={`/restaurant-map-view/:categoryName/:categoryId`}
                component={RestaurantMapView}
              />

              <Route
                history={history}
                exact
                path="/bookings/detail/:categoryName/:categoryId"
                component={HandyDetailPage}
              />

              <Route
                history={history}
                exact
                path="/bookings-professional-services/:categoryId"
                component={PServicesLandingPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-handyman/:categoryId"
                component={HandyManLandingPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-beauty/:categoryId"
                component={BeautyLandingPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-events/:categoryId"
                component={EventsLandingPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-professional/:categoryId"
                component={HandyManLandingPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-sports-tickets/:categoryId"
                component={SportsLandingPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-wellbeing/:categoryId"
                component={WellBeingLandingPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-restaurant/:categoryId"
                component={RestaurentLandingPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-tourism/:categoryId"
                component={TourismLandingPage}
              />
              <Route
                history={history}
                exact
                path="/most-booked-hotels"
                component={MostBooked}
              />
              <Route
                history={history}
                exact
                path="/bookings-category/:categoryName/:categoryId/:subCategoryName/:subCategoryId"
                component={BeautySubCategoryPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-search/:categoryName/:categoryId/:subCategoryName/:subCategoryId"
                component={BeautySearchPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-search/:categoryName/:categoryId"
                component={RestaurantSearchPage}
              />
              <Route
                history={history}
                exact
                path="/bookings-sports-search/:categoryId"
                component={SportsSearchPage}
              />
              <Route
                history={history}
                exact
                path="/view-schedule/:categoryName/:categoryId/:subCategoryName/:subCategoryId/:itemId/:id"
                component={Schedule}
              />
              <Route
                history={history}
                exact
                path="/view-classes/:categoryName/:categoryId/:subCategoryName/:subCategoryId/:itemId/:id"
                component={Classes}
              />
              <Route
                history={history}
                exact
                path="/memberships/:categoryName/:categoryId/:subCategoryName/:subCategoryId/:itemId/:id"
                component={MembershipList}
              />
              <Route
                history={history}
                exact
                path="/payment-complete"
                component={RestaurantPaymentComplete}
              />

              {/* Classified Module routes */}
              {/* automative routes */}
              <Route
                history={history}
                exact
                path={`/classifieds-general/:categoryName/:categoryId`}
                component={SimpleLandingPage}
              />
              <Route
                history={history}
                exact
                path={`/classifieds-general/detail-page/:categoryId/:classified_id`}
                component={Template1DetailPage}
              />
              <Route
                history={history}
                exact
                path="/classifieds/all/general/:all-sub-categories/:categoryName/:categoryId"
                component={SimpleSubCategory}
              />
              <Route
                history={history}
                exact
                path="/classifieds-general/:categoryName/:categoryId/:subCategoryName/:subCategoryId"
                component={SimpleSubCategory}
              />

              {/* real state routes */}
              <Route
                history={history}
                exact
                path={`/classifieds-realestate/:categoryName/:categoryId`}
                component={SimpleLandingPage}
              />
              <Route
                history={history}
                exact
                path={`/classifieds-realestate/detail-page/:categoryId/:classified_id`}
                component={Template3DetailPage}
              />
              <Route
                history={history}
                exact
                path="/classifieds/all/realestate/:all-sub-categories/:categoryName/:categoryId"
                component={SimpleSubCategory}
              />
              <Route
                history={history}
                exact
                path="/classifieds-realestate/:categoryName/:categoryId/:subCategoryName/:subCategoryId"
                component={SimpleSubCategory}
              />

              {/* Job routes routes */}
              <Route
                history={history}
                exact
                path={`/classifieds-jobs/:categoryName/:categoryId`}
                component={SimpleLandingPage}
              />
              <Route
                history={history}
                exact
                path={`/classifieds-jobs/detail-page/:categoryId/:classified_id`}
                component={JobsDetailPage}
              />
              {/* <Route history={history} exact path={`/classifieds-jobs/detail-page/:categoryId/:classified_id`} component={Template1DetailPage} /> */}

              {/* old job listing page routes */}
              {/* <Route history={history} exact path='/classifieds-jobs/all/:all-sub-categories/:categoryName/:categoryId' component={JobSubCategoryList} />
              <Route history={history} exact path='/classifieds-jobs/:categoryName/:categoryId/:subCategoryName/:subCategoryId' component={JobSubCategoryList} /> */}

              {/* new design listing page routes */}
              <Route
                history={history}
                exact
                path="/classifieds-jobs/all/:all-sub-categories/:categoryName/:categoryId"
                component={SimpleSubCategory}
              />
              <Route
                history={history}
                exact
                path="/classifieds-jobs/:categoryName/:categoryId/:subCategoryName/:subCategoryId"
                component={SimpleSubCategory}
              />

              <Route
                history={history}
                exact
                path="/classified-jobs/see-more/:filter/:classified_id"
                component={JobsSeeMore}
              />
              <Route
                history={history}
                exact
                path="/classified-jobs/see-more/:filter"
                component={JobsSeeMore}
              />
              <Route
                history={history}
                exact
                path="/classifieds-jobs/resume-builder"
                component={ResumeBuilder}
              />
              {/* <Route history={history} exact path='/classified-jobs/resume' component={Resume} /> */}

              <Route
                history={history}
                exact
                path="/user-ads/general/:categoryId/:item_id"
                component={FoundUserAds}
              />
              <Route
                history={history}
                exact
                path="/user-ads/realstate/:categoryId/:item_id"
                component={FoundUserAds}
              />

              {/* M4 retail module routes */}
              <Route
                history={history}
                exact
                path="/retail"
                component={RetailLandingPage}
              />
              <Route
                history={history}
                exact
                path="/retail/:filter"
                component={RetailLandingPage}
              />
              <Route
                history={history}
                exact
                path="/retail/:categoryName/:categoryId"
                component={RetailCatLandingPage}
              />
              <Route
                history={history}
                exact
                path="/retail/:categoryName/:categoryId/:subCategoryName/:subCategoryId"
                component={RetailSubCategoryPage}
              />
              <Route
                history={history}
                exact
                path="/retail/:categoryName/:categoryId/:subCategoryName/:subCategoryId/:sub_sub_CategoryName/:sub_sub_CategoryId"
                component={RetailSubCategoryPage}
              />
              <Route
                history={history}
                exact
                path={`/retail/detail-page/:categoryId/:classified_id`}
                component={RetailDetailPage}
              />

              <Route
                history={history}
                exact
                path="/retail-detail/see-more/:filter"
                component={RetailSeeMore}
              />
              <Route
                history={history}
                exact
                path="/retail-detail/see-more/:filter/:categoryName/:categoryId"
                component={RetailSeeMore}
              />

              {/* 17/02/2021 see all page changes */}
              <Route
                history={history}
                exact
                path="/retail-detail/see-more/:filter/:display_type"
                component={RetailSeeMore}
              />
              <Route
                history={history}
                exact
                path="/retail-detail/see-more/:filter/:display_type/:categoryName/:categoryId"
                component={RetailSeeMore}
              />

              <Route
                history={history}
                exact
                path="/retail/filter/:categoryName/:categoryId/:subCategoryName/:subCategoryId"
                component={RetailFilterPage}
              />
              <Route
                history={history}
                exact
                path="/retail-category/filter/:all/:categoryName/:categoryId"
                component={RetailFilterPage}
              />
              <Route
                history={history}
                exact
                path="/user-ads-retail/:filter/:categoryId/:item_id"
                component={FoundUserAds}
              />
              <Route
                history={history}
                exact
                path={`/retail-classifieds/map-view/:templateName/:categoryName/:categoryId/:subCategoryName/:subCategoryId`}
                component={MapView}
              />
              <Route
                history={history}
                exact
                path={`/retail-classifieds/:all/map-view/:templateName/:categoryName/:categoryId/`}
                component={MapView}
              />
              <Route
                history={history}
                exact
                path={`/retail-classifieds/map-view/:templateName/:categoryName/:categoryId/:subCategoryName/:subCategoryId/:classifiedId`}
                component={MapViewDetail}
              />
              <Route
                history={history}
                exact
                path={`/retail-checkout`}
                component={RetailCheckoutProcess}
              />
              <Route
                history={history}
                path="/un-authorize"
                component={UnAuthorized}
              />

              {/* Food Scanner Routes */}
              <Route
                history={history}
                exact
                path="/food-scanner"
                component={FoodScannerLandingPage}
              />
              <Route
                history={history}
                exact
                path="/food-product-detail/:id"
                component={FoodProductDetailPage}
              />
              <Route
                history={history}
                exact
                path="/add-product"
                component={AddProduct}
              />
              <Route
                history={history}
                exact
                path="/see-all-products/:listType"
                component={SeeAllProducts}
              />
              <Route
                history={history}
                exact
                path="/compare-product"
                component={CompareFoodProduct}
              />

              {/*Static Pages URL*/}
              <Route history={history} exact path="/faq" component={FAQPage} />
              <Route
                history={history}
                exact
                path="/footer-pages/contact-us"
                component={ContactPages}
              />
              <Route
                history={history}
                exact
                path="/footer-pages/:slug"
                component={StaticPages}
              />
              <Route
                history={history}
                exact
                path="/mobile-app/screen"
                component={MobileAppScreen}
              />

              {/* Retail Checkout Page UI */}
              <Route
                history={history}
                exact
                path="/retail-checkout"
                component={RetailCheckout}
              />
               <Route
                history={history}
                exact
                path="/payment-complete-orders"
                component={RetailPaymentComplete}
              />

              {/* Retail Checkout Order Summary Page UI */}
              <Route
                history={history}
                exact
                path="/checkout-order-summary"
                component={CheckoutOrderSummary}
              />

              {/* Retail Payment Complete Page UI */}
              <Route
                history={history}
                exact
                path="/payment-complete"
                component={PaymentComplete}
              />

              {isLoggedIn && isPrivateUser && (
                <Switch>
                  {!menuSkiped && (
                    <Route
                      history={history}
                      exact
                      path="/intermediate"
                      component={InterMediateStep}
                    />
                  )}
                  {merchant ? (
                    <Route
                      history={history}
                      exact
                      path="/post-an-ad"
                      component={RetailPostAd}
                    />
                  ) : (
                    <Route
                      history={history}
                      exact
                      path="/post-an-ad"
                      component={PostAd}
                    />
                  )}
                  <Route
                    history={history}
                    exact
                    path="/booking-checkout"
                    component={BookingCheckout}
                  />
                  <Route
                    history={history}
                    exact
                    path="/restaurent-checkout"
                    component={RestaurentCheckout}
                  />
                  {/* route for handyman checkout success */}
                  <Route
                    history={history}
                    exact
                    path="/job_checkout_success"
                    component={HandymanBookingCheckoutSuccess}
                  />
                  {/* route for handyman checkout success */}

                  <Route
                    history={history}
                    exact
                    path="/my-bookings"
                    component={AuthMiddleware(CustomerMyBookings)}
                  />
                  <Route
                    history={history}
                    exact
                    path="/my-bookings/event-booking-details/:id"
                    component={AuthMiddleware(MyEventBookingDetails)}
                  />

                  {/* handyman Booking Route */}
                  <Route
                    history={history}
                    exact
                    path="/my-bookings/handyman-booking-details/:id"
                    component={AuthMiddleware(handymanBookingDetails)}
                  />
                  {/* handyman Booking Route */}

                  <Route
                    history={history}
                    exact
                    path="/my-booking/spa"
                    component={AuthMiddleware(MyBookings)}
                  />
                  <Route
                    history={history}
                    exact
                    path="/spa/customer-booking-detail/:serviceBookingId"
                    component={AuthMiddleware(CustomerSpaBookingDetails)}
                  />
                  <Route
                    history={history}
                    exact
                    path="/spa/customer-booking-history-detail/:serviceBookingId"
                    component={AuthMiddleware(CustomerSpaBookingHistoryDetails)}
                  />
                  <Route
                    history={history}
                    exact
                    path="/my-orders/restaurant"
                    component={AuthMiddleware(MyRestaurantOrders)}
                  />
                   <Route
                    history={history}
                    exact
                    path="/my-orders/retail"
                    component={AuthMiddleware(MyRetailOrders)}
                  />
                  <Route
                    history={history}
                    exact
                    path="/restaurant/customer-track-order/:orderId"
                    component={AuthMiddleware(TrackUserRestaurantOrders)}
                  />
                  <Route
                    history={history}
                    exact
                    path="/my-booking/beauty"
                    component={AuthMiddleware(CustomerMyBookingsBeauty)}
                  />
                  <Route
                    history={history}
                    exact
                    path="/retail-orders"
                    component={AuthMiddleware(UserRetailDashboard)}
                  />
                  <Route
                    history={history}
                    exact
                    path="/dashboard-classified"
                    component={AuthMiddleware(UserClassifiedsDashboard)}
                  />
                  <Route
                    history={history}
                    exact
                    path="/cart"
                    component={AuthMiddleware(UserRetailCartDetail)}
                  />
                  <Route
                    history={history}
                    exact
                    path="/beauty/customer-booking-detail/:serviceBookingId"
                    component={AuthMiddleware(CustomerBeautyBookingDetails)}
                  />
                  <Route
                    history={history}
                    exact
                    path="/beauty/customer-booking-history-detail/:serviceBookingId"
                    component={AuthMiddleware(
                      CustomerBeautyBookingHistoryDetails
                    )}
                  />
                  <Route
                    history={history}
                    exact
                    path="/restaurant-cart"
                    component={AuthMiddleware(RestaurantCartDetail)}
                  />
                  <Route
                    history={history}
                    exact
                    path="/fitness-my-booking-detail/:classBookingId"
                    component={AuthMiddleware(CustomerFitnessBookingDetails)}
                  />
                  <Route
                    history={history}
                    exact
                    path="/fitness/customer-booking-history-detail/:serviceBookingId"
                    component={AuthMiddleware(
                      CustomerFitnessBookingHistoryDetails
                    )}
                  />
                  <Route
                    history={history}
                    exact
                    path="/dashboard"
                    component={AuthMiddleware(UserDashboard)}
                  />
                  <Route
                    history={history}
                    exact
                    path="/notifications"
                    component={AuthMiddleware(UserNotification)}
                  />

                  <Route
                    history={history}
                    exact
                    path="/wishlist"
                    component={AuthMiddleware(UserWishlist)}
                  />
                  <Route
                    history={history}
                    exact
                    path="/my-ads"
                    component={AuthMiddleware(MyAds)}
                  />
                  <Route
                    history={history}
                    exact
                    path="/edit-post-an-ad/:adId"
                    component={UpdatePostAnAd}
                  />
                  <Route
                    history={history}
                    exact
                    path="/reviews"
                    component={AuthMiddleware(UserReview)}
                  />
                  <Route
                    history={history}
                    exact
                    path="/retail-review/:itemId"
                    component={AuthMiddleware(RetailProductReview)}
                  />
                  <Redirect to="/" />
                </Switch>
              )}

              {!isLoggedIn && (
                <Switch>
                  <Route
                    history={history}
                    exact
                    path="/signup"
                    component={SignUp}
                  />
                  <Route
                    history={history}
                    exact
                    path="/reset-password/:token"
                    component={WelComePage}
                  />
                  <Route history={history} path="*" component={PageNotFound} />
                </Switch>
              )}
            </Switch>
          )}
          <Switch>
            {isLoggedIn && !isPrivateUser && (
              <Switch>
                <Route
                  history={history}
                  exact
                  path="/received-orders"
                  component={AuthMiddleware(ReceivedOrder)}
                />
                <Route
                  history={history}
                  exact
                  path="/transaction"
                  component={AuthMiddleware(VendorTransaction)}
                />
                <Route
                  history={history}
                  exact
                  path="/vendor-retail-invoice"
                  component={AuthMiddleware(VendorRetailInvoice)}
                />
                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.fitness && (
                    <Route
                      history={history}
                      exact
                      path="/fitness-my-bookings"
                      component={AuthMiddleware(FitnessVenderMyBookings)}
                    />
                  )}
                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.wellbeing && (
                    <Route
                      history={history}
                      exact
                      path="/spa-my-bookings"
                      component={AuthMiddleware(HandymanVenderMyBookings)}
                    />
                  )}
                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.beauty && (
                    <Route
                      history={history}
                      exact
                      path="/beauty-my-bookings"
                      component={AuthMiddleware(HandymanVenderMyBookings)}
                    />
                  )}
                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.fitness && (
                    <Route
                      history={history}
                      exact
                      path="/fitness-vendor-manage-classes"
                      component={AuthMiddleware(FitnessMyProfileSetup)}
                    />
                  )}
                {loggedInUser &&
                  loggedInUser.user_type === langs.key.restaurant && (
                    <Route
                      history={history}
                      exact
                      path="/order-tracking"
                      component={AuthMiddleware(OrderTracking)}
                    />
                  )}
                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.events && (
                    <Route
                      history={history}
                      exact
                      path="/events-my-bookings"
                      component={AuthMiddleware(EventVenderMyBookings)}
                    />
                  )}
                {loggedInUser &&
                  (loggedInUser.user_type === langs.key.handyman ||
                    loggedInUser.user_type === "trader") && (
                    <Route
                      history={history}
                      exact
                      path="/handyman-my-bookings"
                      component={AuthMiddleware(HandymanVenderMyBookings)}
                    />
                  )}
                {loggedInUser &&
                  loggedInUser.user_type === langs.key.restaurant && (
                    <Route
                      history={history}
                      exact
                      path="/restaurant-my-orders"
                      component={AuthMiddleware(RestaurantVendorOrderList)}
                    />
                  )}
                <Route
                  history={history}
                  exact
                  path="/dashboard-calendar"
                  component={AuthMiddleware(BookingCalendarView)}
                  // component={AuthMiddleware(UserDashboard)}
                />
                {/* classified vendors dashboard */}
                {loggedInUser.profile_completed == 1 ? (
                  <Route
                    history={history}
                    exact
                    path="/"
                    component={() => {
                      console.log(
                        "loggedInUser.user_type 1",
                        loggedInUser.user_type
                      );
                      if (
                        loggedInUser.user_type === langs.key.handyman ||
                        loggedInUser.user_type === "trader"
                      ) {
                        return <HandyManDashboard history={history} />;
                      } else if (merchant) {
                        return <VendorRetailDashboard history={history} />;
                      } else if (
                        loggedInUser.user_type === langs.key.restaurant
                      ) {
                        //Restaurant dashboard
                        return <RestaurantVendorDashboard history={history} />;
                      } else if (
                        loggedInUser.user_type === langs.userType.fitness
                      ) {
                        console.log("HERE 2");
                        return <FitnessVendorDashboard history={history} />;
                      } else if (
                        loggedInUser.user_type === langs.userType.events
                      ) {
                        console.log("HERE 4");
                        return <EventVendorDashboard history={history} />;
                      } else if (
                        loggedInUser.user_type !== langs.key.business
                      ) {
                        return <HandyManDashboard history={history} />;
                      } else {
                        return <Dashboard history={history} />;
                      }
                    }}
                  />
                ) : (
                  <Route
                    history={history}
                    exact
                    path="/"
                    component={() => {
                      console.log(
                        "loggedInUser.user_type 2",
                        loggedInUser.user_type
                      );
                      console.log(
                        "loggedInUser.user_type: $$$$",
                        loggedInUser.user_type,
                        merchant
                      );
                      if (merchant) {
                        return <VendorRetailEditProfile history={history} />;
                      } else if (
                        loggedInUser.user_type !== langs.key.business
                      ) {
                        return <EventCatereEditProfile history={history} />;
                      } else {
                        return <EditProfile history={history} />;
                      }
                    }}
                  />
                )}

                <Route
                  history={history}
                  exact
                  path="/dashboard"
                  component={() => {
                    console.log(
                      "loggedInUser.user_type 2",
                      loggedInUser.user_type
                    );
                    // Handyman dashboard
                    if (
                      loggedInUser.user_type === langs.key.handyman ||
                      loggedInUser.user_type === "trader"
                    ) {
                      return <HandyManDashboard history={history} />;
                    } else if (merchant) {
                      //Retail dashboard
                      return <VendorRetailDashboard history={history} />;
                    } else if (
                      loggedInUser.user_type === langs.key.restaurant
                    ) {
                      //Restaurant dashboard
                      return <RestaurantVendorDashboard history={history} />;
                    } else if (
                      loggedInUser.user_type === langs.userType.fitness
                    ) {
                      return <FitnessVendorDashboard history={history} />;
                    } else if (
                      loggedInUser.user_type === langs.userType.events
                    ) {
                      console.log("HERE 4");
                      return <EventVendorDashboard history={history} />;
                    } else if (loggedInUser.user_type !== langs.key.business) {
                      //Booking Static dashboard
                      return <HandyManDashboard history={history} />;
                    } else {
                      //Classified dashboard

                      return <Dashboard history={history} />;
                    }
                  }}
                />

                {/* TODO:: Need to implement the route */}
                {/* {loggedInUser && loggedInUser.user_type !== langs.key.business ?
                        <Route history={history} exact path='/dashboard'
                            component={() => {
                               return <RestaurantVendorDashboard history={history} />
                            }}
                        /> : <Route history={history} exact path='/dashboard'
                            component={() => {
                                if (merchant) {
                                  return <VendorRetailDashboard history={history} />
                                }else if (loggedInUser.user_type !== langs.key.business) {
                                    return <BookingDashboard history={history} />
                                }else {
                                  return <Dashboard history={history} />
                                }
                            }}
                        />
                      } */}

                <Route
                  history={history}
                  exact
                  path="/reviews"
                  component={AuthMiddleware(Review)}
                />

                <Route
                  history={history}
                  exact
                  path="/retail-review/:itemId"
                  component={AuthMiddleware(RetailProductReview)}
                />

                {merchant ? (
                  <Route
                    history={history}
                    exact
                    path="/post-an-ad"
                    component={RetailPostAd}
                  />
                ) : (
                  <Route
                    history={history}
                    exact
                    path="/post-an-ad"
                    component={PostAd}
                  />
                )}
                {merchant ? (
                  <Route
                    history={history}
                    exact
                    path="/edit-post-an-ad/:adId"
                    component={UpdateRetailPostAnAd}
                  />
                ) : (
                  <Route
                    history={history}
                    exact
                    path="/edit-post-an-ad/:adId"
                    component={UpdatePostAnAd}
                  />
                )}
                {merchant ? (
                  <Route
                    history={history}
                    exact
                    path="/repost-ad/:filter/:adId"
                    component={UpdateRetailPostAnAd}
                  />
                ) : (
                  <Route
                    history={history}
                    exact
                    path="/repost-ad/:filter/:adId"
                    component={UpdatePostAnAd}
                  />
                )}

                {merchant && (
                  <Route
                    history={history}
                    exact
                    path="/daily-deals"
                    component={AuthMiddleware(RetailDailyDeals)}
                  />
                )}
                {merchant && (
                  <Route
                    history={history}
                    exact
                    path="/my-deals"
                    component={AuthMiddleware(RetailDailyDealsList)}
                  />
                )}

                <Route
                  history={history}
                  exact
                  path="/payment-methods"
                  component={PaymentMethods}
                />
                <Route
                  history={history}
                  exact
                  path="/edit-payment-methods/:id"
                  component={EditPaymentMethods}
                />
                <Route
                  history={history}
                  exact
                  path="/add-payment-methods"
                  component={AddPaymentMethods}
                />
                <Route
                  history={history}
                  exact
                  path="/change-password"
                  component={AuthMiddleware(ChangePassword)}
                />
                <Route
                  history={history}
                  exact
                  path="/editProfile"
                  component={AuthMiddleware(VendorEditProfile)}
                />
                <Route
                  history={history}
                  exact
                  path="/myProfile"
                  component={AuthMiddleware(MyProfile)}
                />
                <Route
                  history={history}
                  exact
                  path="/message"
                  component={AuthMiddleware(Message)}
                />
                <Route
                  history={history}
                  exact
                  path="/notifications"
                  component={AuthMiddleware(UserNotification)}
                />
                {realStateVendor && (
                  <Route
                    history={history}
                    exact
                    path="/inspection"
                    component={AuthMiddleware(InspectionList)}
                  />
                )}
                {realStateVendor && (
                  <Route
                    history={history}
                    exact
                    path="/inspection-detail/:id"
                    component={AuthMiddleware(InspectionDetails)}
                  />
                )}

                {/* vendor profile routes */}
                {loggedInUser &&
                  (loggedInUser.user_type === langs.key.business ||
                    merchant) && (
                    <Route
                      history={history}
                      exact
                      path="/my-ads"
                      component={AuthMiddleware(MyAds)}
                    />
                  )}

                {loggedInUser && loggedInUser.role_slug === langs.key.job && (
                  <Route
                    history={history}
                    exact
                    path="/job-applications"
                    component={AuthMiddleware(JobApplicationList)}
                  />
                )}
                {loggedInUser && loggedInUser.role_slug === langs.key.job && (
                  <Route
                    history={history}
                    exact
                    path="/application-detail/:id"
                    component={AuthMiddleware(ApplicationDetails)}
                  />
                )}

                {loggedInUser &&
                  loggedInUser.role_slug === langs.key.car_dealer && (
                    <Route
                      history={history}
                      exact
                      path="/application-detail/:id"
                      component={AuthMiddleware(GeneralVendorMyOfferDetail)}
                    />
                  )}
                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.beauty && (
                    <Route
                      history={history}
                      exact
                      path="/services"
                      // component={AuthMiddleware(BeautyServiceList)}
                      component={AuthMiddleware(SpaServices)}
                    />
                  )}
                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.beauty && (
                    <Route
                      history={history}
                      exact
                      path="/update-vendor-services/:activeTab/:id"
                      component={AuthMiddleware(UpdateServive)}
                    />
                  )}
                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.beauty && (
                    <Route
                      history={history}
                      exact
                      path="/update-vendor-services"
                      component={AuthMiddleware(UpdateBeautyService)}
                    />
                  )}
                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.wellbeing && (
                    <Route
                      history={history}
                      exact
                      path="/vendor-services"
                      component={AuthMiddleware(SpaServices)}
                    />
                  )}
                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.wellbeing && (
                    <Route
                      history={history}
                      exact
                      path="/add-services"
                      component={AuthMiddleware(AddServices)}
                    />
                  )}
                  {}
                {loggedInUser &&
                  (loggedInUser.user_type === langs.userType.wellbeing ||
                  loggedInUser.user_type === langs.userType.beauty) && (
                    <Route
                      history={history}
                      exact
                      path="/edit-spa-service/:id"
                      component={AuthMiddleware(UpdateSpaServices)}
                    />
                  )}
                <Route
                  history={history}
                  exact
                  path="/my-menu"
                  component={AuthMiddleware(RestaurantMenu)}
                />
                <Route
                  history={history}
                  exact
                  path="/edit-menu"
                  component={AuthMiddleware(UpdateRestaurantMenu)}
                />
                <Route
                  history={history}
                  exact
                  path="/add-menu"
                  component={AuthMiddleware(AddRestaurantMenu)}
                />
                <Route
                  history={history}
                  exact
                  path="/vendor-profile"
                  component={AuthMiddleware(EventCatereMyProfile)}
                />

                {merchant ? (
                  <>
                    <Route
                      history={history}
                      exact
                      path="/vendor-profile-setup"
                      component={AuthMiddleware(VendorRetailEditProfile)}
                    />
                    <Route
                      history={history}
                      exact
                      path="/vendor-profile-setup/:cid"
                      component={AuthMiddleware(VendorRetailEditProfile)}
                    />
                  </>
                ) : (
                  <>
                    <Route
                      history={history}
                      exact
                      path="/vendor-profile-setup/:cid"
                      component={AuthMiddleware(EventCatereEditProfile)}
                    />
                    <Route
                      history={history}
                      exact
                      path="/vendor-profile-setup/:step"
                      component={AuthMiddleware(EventCatereEditProfile)}
                    />
                    <Route
                      history={history}
                      exact
                      path="/vendor-profile-setup"
                      // render={(props) => AuthMiddleware(<EventCatereEditProfile {...props}/>)}
                      component={AuthMiddleware(EventCatereEditProfile)}
                    />
                  </>
                )}

                <Route
                  history={history}
                  exact
                  path="/business-profile"
                  component={AuthMiddleware(MyProfile)}
                />
                <Route
                  history={history}
                  exact
                  path="/edit-business-Profile"
                  component={EditProfile}
                />

                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.fitness && (
                    <Route
                      history={history}
                      exact
                      path="/fitness-vendor-manage-classes"
                      component={AuthMiddleware(FitnessMyProfileSetup)}
                    />
                  )}
                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.fitness && (
                    <Route
                      history={history}
                      exact
                      path="/fitness-vendor-edit-classes/:id/:classId"
                      component={AuthMiddleware(FitnessEditClass)}
                    />
                  )}
                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.fitness && (
                    <Route
                      history={history}
                      exact
                      path="/fitness-vendor-edit-membership/:packageId"
                      component={AuthMiddleware(FitnessEditClass)}
                    />
                  )}
                {showDeals && (
                  <Route
                    history={history}
                    exact
                    path="/daily-deals"
                    component={AuthMiddleware(CreateDeals)}
                  />
                )}
                {showDeals && (
                  <Route
                    history={history}
                    exact
                    path="/my-deals"
                    component={AuthMiddleware(MyDeals)}
                  />
                )}
                {showDeals && (
                  <Route
                    history={history}
                    exact
                    path="/my-promotions"
                    component={AuthMiddleware(MyPromotions)}
                  />
                )}
                {showDeals && (
                  <Route
                    history={history}
                    exact
                    path="/create-promotions"
                    component={AuthMiddleware(CreatePromotions)}
                  />
                )}

                {showDeals &&
                  loggedInUser.user_type === langs.key.restaurant && (
                    <Route
                      history={history}
                      exact
                      path="/my-offers"
                      component={AuthMiddleware(MySpecialOffers)}
                    />
                  )}
                {showDeals &&
                  loggedInUser.user_type === langs.key.restaurant && (
                    <Route
                      history={history}
                      exact
                      path="/create-offers"
                      component={AuthMiddleware(CreateOffers)}
                    />
                  )}

                {showPackages && (
                  <Route
                    history={history}
                    exact
                    path="/my-packages"
                    component={AuthMiddleware(MyBestPacakges)}
                  />
                )}
                {showPackages && (
                  <Route
                    history={history}
                    exact
                    path="/create-packages"
                    component={AuthMiddleware(CreateBestPackages)}
                  />
                )}
                {loggedInUser.role_slug === langs.key.car_dealer && (
                  <Route
                    history={history}
                    exact
                    path="/my-offer"
                    component={AuthMiddleware(GeneralVendorMyOffer)}
                  />
                )}
                {loggedInUser.role_slug === langs.key.car_dealer && (
                  <Route
                    history={history}
                    exact
                    path="/my-offer-details/:id"
                    component={AuthMiddleware(GeneralVendorMyOfferDetail)}
                  />
                )}

                {/* M3 Routes */}
                {/* {loggedInUser &&
                  loggedInUser.user_type === langs.userType.wellbeing && (
                    <Route
                      history={history}
                      exact
                      path="/spa-my-bookings"
                      component={AuthMiddleware(VendorMyBookingsSpa)}
                    />
                  )} */}
                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.wellbeing && (
                    <Route
                      history={history}
                      exact
                      path="/vendor-spa-bookings-detail/:serviceBookingId"
                      component={AuthMiddleware(VendorSpaBookingDetails)}
                    />
                  )}
                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.wellbeing && (
                    <Route
                      history={history}
                      exact
                      path="/spa-my-bookings-calender"
                      component={AuthMiddleware(VendorSpaMyBookingCalender)}
                    />
                  )}
                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.wellbeing && (
                    <Route
                      history={history}
                      exact
                      path="/vendor-spa-booking-history-detail/:serviceBookingId"
                      component={AuthMiddleware(VendorSpaBookingHistoryDetails)}
                    />
                  )}

                {/* {loggedInUser &&
                  loggedInUser.user_type === langs.userType.beauty && (
                    <Route
                      history={history}
                      exact
                      path="/beauty-my-bookings"
                      component={AuthMiddleware(VendorMyBookingsBeauty)}
                    />
                  )} */}
                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.beauty && (
                    <Route
                      history={history}
                      exact
                      path="/beauty-my-bookings-calender"
                      component={AuthMiddleware(VendorBeautyMyBookingCalender)}
                    />
                  )}
                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.beauty && (
                    <Route
                      history={history}
                      exact
                      path="/vendor-beauty-bookings-detail/:serviceBookingId"
                      component={AuthMiddleware(VendorBeautyBookingDetails)}
                    />
                  )}
                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.beauty && (
                    <Route
                      history={history}
                      exact
                      path="/vendor-beauty-booking-history-detail/:serviceBookingId"
                      component={AuthMiddleware(
                        VendorBeautyBookingHistoryDetails
                      )}
                    />
                  )}

                {/* {loggedInUser &&
                  loggedInUser.user_type === langs.key.restaurant && (
                    <Route
                      history={history}
                      exact
                      path="/restaurant-my-orders"
                      component={AuthMiddleware(RestaurantVendorOrderList)}
                    />
                  )} */}
                {/* {loggedInUser &&
                  loggedInUser.user_type === langs.userType.fitness && (
                    <Route
                      history={history}
                      exact
                      path="/fitness-my-bookings"
                      component={AuthMiddleware(FitnessVenderMyBookings)}
                    />
                  )} */}
                {/* {loggedInUser &&
                  loggedInUser.user_type === langs.key.handyman && (
                    <Route
                      history={history}
                      exact
                      path="/handyman-my-bookings"
                      component={AuthMiddleware(HandymanVenderMyBookings)}
                    />
                  )} */}
                {/* {loggedInUser &&
                  loggedInUser.user_type === langs.userType.events && (
                    <Route
                      history={history}
                      exact
                      path="/events-my-bookings"
                      component={AuthMiddleware(EventVenderMyBookings)}
                    />
                  )} */}
                {/*m4 retail module vendor routes*/}
                {/* <Route
                  history={history}
                  exact
                  path="/received-orders"
                  component={AuthMiddleware(ReceivedOrder)}
                />
               
                <Route
                  history={history}
                  exact
                  path="/vendor-retail-invoice"
                  component={AuthMiddleware(VendorRetailInvoice)}
                />*/}
                 <Route
                  history={history}
                  exact
                  path="/transaction"
                  component={AuthMiddleware(VendorTransaction)}
                />
                {merchant && (
                  <Route
                    history={history}
                    merchant={true}
                    exact
                    path="/payment"
                    component={AuthMiddleware(RetailPaymentScreen)}
                  />
                )}

                {loggedInUser &&
                  loggedInUser.user_type === langs.userType.fitness && (
                    <Route
                      history={history}
                      exact
                      path="/fitness-vendor-mycalendar"
                      component={AuthMiddleware(FitnessVenderMyCalendar)}
                    />
                  )}

                <Redirect to="/" />
                <Route history={history} path="*" component={UnAuthorized} />
              </Switch>
            )}
          </Switch>
        </Switch>
      </Suspense>
    );
  }

  //routes
}
const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    authToken: auth.isLoggedIn ? auth.loggedInUser.token : "",
    loggedInUser: auth.isLoggedIn ? auth.loggedInUser : null,
    isPrivateUser: auth.isLoggedIn
      ? auth.loggedInUser.user_type === langs.key.private
      : false,
    menuSkiped: auth.isLoggedIn ? auth.loggedInUser.menu_skipped === 1 : false,
  };
};
export default connect(mapStateToProps, null)(Routes);