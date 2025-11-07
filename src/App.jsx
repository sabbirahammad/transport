import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CustomerList from './pages/customar/CustomerList'
import CustomerManagement from './pages/customar/CustomerManagement'
import Layout from './componend/Layout'
import Dashboard from './pages/Dashboard'

import CreateCustomar from './pages/customar/CreateCustomar'
import RoutePricing from './pages/customar/RoutePricing'
import Vehicle from './pages/fleet Management/Vehicle'
import CreateVehicle from './pages/fleet Management/CreateVehicle'
import AddTrip from './pages/fleet Management/AddTrip'
import BrandCards from './pages/fleet Management/Customer'
import Sujuki from './pages/fleet Management/Rancon/Sujuki'
import TripList from './pages/fleet Management/Rancon/TripList'
import SujukiHonda from './pages/fleet Management/Rancon/SujukiHonda'
import AciBrand from './pages/fleet Management/AciBrand'
import AciBrandBill from './pages/fleet Management/AciBrandBill'
import AciBillrecord from './pages/fleet Management/AciBillrecord'
import Premiafix from './pages/fleet Management/premiaflix/Premiafix'
import AddTripName from './pages/fleet Management/premiaflix/AddTripName'
import MahindraList from './pages/fleet Management/Mahindra/MahindraList'
import AddTripNameMahindra from './pages/fleet Management/Mahindra/AddTripName'
import MahindraBillrecord from './pages/fleet Management/Mahindra/MahindraBillrecord'
import MahindraBill from './pages/fleet Management/Mahindra/MahindraBill'
import AddEmployee from './pages/hr/imployeee/AddEmployee'
import Imployee from './pages/hr/imployeee/Imployee'
import Driver from './pages/hr/driver/Driver'
import AddDriver from './pages/hr/driver/AddDriver'
import HelperPage from './pages/hr/helper/Helper'
import AddHelper from './pages/hr/helper/AddHelper'
import OfficePage from './pages/hr/office/office'
import AddStaff from './pages/hr/office/AddStaff'
import DealerPage from './pages/customar/Dealer/Dealer'
import AddDealer from './pages/customar/Dealer/AddDealer'
import PurchaseList from './pages/purchase/PurchaseList'
import AddPricing from './pages/customar/AddPricing'
import PremiafixBill from './pages/fleet Management/premiaflix/PremiafixBill'
import MahindraAddTripName from './pages/fleet Management/Mahindra/AddTripName'

import HatimList from './pages/fleet Management/Hatim/HatimList'
import CreateHatim from './pages/fleet Management/Hatim/CreateHatim'
import Billrecord from './pages/fleet Management/Hatim/Billrecord'
import HatimBill from './pages/fleet Management/Hatim/HatimBill'
import Addfridgerecord from './pages/fleet Management/Rancon/Addfridgerecord'
import Addhondarecord from './pages/fleet Management/Rancon/Addhondarecord'

import TripField from './pages/BrandManagement/TripField'
import BillFieldSelector from './pages/BrandManagement/BillField'
import CustomTripList from './pages/BrandManagement/CustomTripList'
import CustomBillList from './pages/BrandManagement/CustomBillList'
import { useParams } from 'react-router-dom'

import Customer from './components/Customer'
import CustomBillRecord from './pages/BrandManagement/CustomBillRecord'
import AddCustomTrip from './pages/BrandManagement/AddTrip'
import Profit from './pages/Profit/Profit'
import AddProfit from './pages/Profit/AddProfit'
import Security from './pages/Profit/Sequrity'
import TripExpense from './pages/fleet Management/Trip Expense/TripExpense'
import Outsidetrip from './pages/fleet Management/outsidetrip/Outsidetrip'
import Summary from './pages/fleet Management/outsidetrip/Summary'
import AddOutsideTrip from './pages/fleet Management/outsidetrip/AddOutsideTrip'
import OutsideTripDetails from './pages/fleet Management/outsidetrip/OutsideTripDetails'
import AddPurchase from './pages/purchase/AddPurchase'
import OunVehicle from './pages/Ownvehicle/OunVehicle'
import Home from './componend/Home/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrapper for all routes */}
        <Route path='/' element={<Layout />}>
          {/* Nested routes - these will render inside Layout */}
          <Route index element={<Dashboard />} />
          <Route path='/customer' element={<CustomerList />} />
          <Route path='/Triplist' element={<TripList />} />
          {/* Add more routes here as needed */}
          <Route path='/create-customer' element={<CreateCustomar/>} />
          <Route path='/customer-pricing' element={<RoutePricing/>} />
          <Route path='/vehicle' element={<Vehicle/>}/>
          <Route path='/create-vehicle' element={<CreateVehicle/>}/>
          <Route path='/create-trip/:category' element={<AddTrip/>}/>
          <Route path='/customerproduct' element={<BrandCards/>} />
          <Route path='/fridge/:category' element={<Sujuki/>} />
          <Route path='/honda/:category' element={<SujukiHonda/>} />
          <Route path='/brand/aci' element={<AciBrand/>} />
          <Route path='/brand/aci/bill/:category' element={<AciBrandBill/>} />
          <Route path='/acibillrecord/:category' element={<AciBillrecord/>} />
          <Route path='/brand/premiaflix' element={<Premiafix/>} />
          <Route path='/add-trip-name' element={<AddTripName/>} />
          <Route path='/mahindra' element={<MahindraList/>} />
          <Route path='/mahindra/add-trip' element={<AddTripNameMahindra/>} />
          <Route path='/mahindrabillrecord' element={<MahindraBillrecord/>} />
          <Route path='/mahindrabill' element={<MahindraBill/>} />
          <Route path='/add-employee' element={<AddEmployee/>} />
          <Route path='/employee' element={<Imployee/>}/>
          <Route path='/driver' element={<Driver/>}/>
          <Route path='/add-driver' element={<AddDriver/>}/>
          <Route path='/helper' element={<HelperPage/>}/>
          <Route path='/add-helper' element={<AddHelper/>}/>
          <Route path='/office' element={<OfficePage/>}/>
          <Route path='/add-office' element={<AddStaff/>}/>
          <Route path='/dealer' element={<DealerPage/>}/>
          <Route path='/add-dealer' element={<AddDealer/>}/>
          <Route path='/purchase' element={<PurchaseList/>}/>
          <Route path='/purchase/add' element={<AddPurchase/>}/>
          <Route path='/add-pricing' element={<AddPricing/>}/>
          <Route path='/brand/premiaflix' element={<Premiafix/>}/>
          <Route path='/premiaflixbill' element={<PremiafixBill/>}/>
          <Route path='/brand/mahindra' element={<MahindraList/>}/>
          <Route path='/mahindraaddtrip' element={<MahindraAddTripName/>}/>
          <Route path='/brand/hatim' element={<HatimList/>}/>
          <Route path='/create-hatim' element={<CreateHatim/>}/>
          <Route path='/billrecord/:category' element={<Billrecord/>}/>
          <Route path='/hatimbill' element={<HatimBill/>}/>
          <Route path='/fridgebillrecord' element={<Addfridgerecord/>}/>
          <Route path='/hondabillrecord' element={<Addhondarecord/>}/>
          <Route path='/addtrip' element={<TripField/>}/>
          <Route path='/bill-field' element={<BillFieldSelector/>}/>
          <Route path='/custom-trip-list' element={<CustomTripList/>}/>
          <Route path='/customer/:id/custom-bill-list' element={<CustomBillList/>}/>

          {/* New routes for customer management and trip field selection */}
          <Route path='/customers' element={<Customer />} />
          <Route path='/customer/:id/trip-field' element={<TripField />} />
          <Route path='/customer/:id/bill-field' element={<BillFieldSelector />} />
          <Route path='/customer/:id/bill' element={<CustomBillList />} />
          <Route path='/customer/:id/trips' element={<CustomTripList />} />
          <Route path='/customer/:id/trips/:id' element={<CustomTripList />} />
          <Route path='/custom-bill-list' element={<CustomBillList/>}/>
          <Route path='/customer/:id' element={<Customer />} />
          <Route path='/customer/:id/:name' element={<Customer />} />
          <Route path='/customer/:id/custombillrecord' element={<CustomBillRecord/>}/>
          <Route path='/add-trip/:productId' element={<AddCustomTrip/>}/>
          <Route path='/profit' element={<Profit/>}/>
          <Route path='/add-profit' element={<AddProfit/>}/>
          <Route path='/security' element={<Security/>}/>
          <Route path='/tripexpense' element={<TripExpense/>}/>
          <Route path='/outside' element={<Outsidetrip/>}/>
          <Route path='/outside/:id' element={<OutsideTripDetails/>}/>
          <Route path='/addoutside' element={<Summary/>}/>
          <Route path='/add-outside-trip' element={<AddOutsideTrip/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/ounvehicle' element={<OunVehicle/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

