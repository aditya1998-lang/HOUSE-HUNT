import { setUserProperties } from 'firebase/analytics'
import {getAuth,updateProfile} from 'firebase/auth'
import {useState,useEffect, useRef} from 'react'
import { useNavigate ,Link } from 'react-router-dom'
import {collection,getDocs,query,where,orderBy,deleteDoc ,doc, updateDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from  '../assets/svg/homeIcon.svg'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Profile() {

  const auth = getAuth()
  const [loading,setLoading]=useState(true)
  const [listings,setListings]=useState(null)
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const navigate = useNavigate()
  const { name, email } = formData
  const [user, SetUser] = useState(null)
  //  console.log(auth)


useEffect(()=>{
   //fetch listings of a particular user//
  const fetchUserListings=async()=>{
   const listingsRef=collection(db,'listings')
   const q=query(listingsRef
    ,where('userRef','==',auth.currentUser.uid),orderBy('timestamp','desc')
    )


  const querySnap=await getDocs(q)
    let listings=[]
    querySnap.forEach((doc)=>{
      return listings.push({id:doc.id,data:doc.data()})
    })
    setListings(listings)
    setLoading(false)
  }
  
fetchUserListings()
  


},[auth.currentUser.uid])








  //used to signout from auth(instance of firebase)
  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }


console.log(auth);


  // used to update the profile name in firebase
  const onSubmit=async()=>{    
    try{
      if(auth.currentUser.displayName!==name)
      {
     await updateProfile(auth.currentUser, {displayName:name})
     const userRef=doc(db,'users',auth.currentUser.uid)
     await updateDoc(userRef,{name : name})
      }
    }catch(error){
      toast.error('could not update profile details')
    }
  }


  //for updatinf the form in the input field//
   const onChange=(e)=>{
      setFormData((prevState)=>({
        ...prevState,
        [e.target.id]: e.target.value,


      }))
       


   }
  //delete the listing from firebase and profile page
   const onDelete=async(listingId)=>{
     if(window.confirm('Are you sure you want to delete'))
     {
        await deleteDoc(doc(db,'listings',listingId))
   const updatedListings=listings.filter((listing)=>
       listing.id!==listingId)
       setListings(updatedListings)
       toast.success('successfully deleted listing')
      }

   }

  const onEdit=(listingId)=>navigate(`/edit-listing/${listingId}`)





  if(loading)
  {
   return  <Spinner/>
  }


  return  <>
   
     <div className="profile">
       <header className="profileHeader">
         <p className="pageHeader">
           My Profile
         </p>
         <button type='button' className="logOut" onClick={onLogout}>
  Logout
         </button>
       </header>

         <main>

       <div className="profileDetailsHeader">

    <p className="profileDetailsText">Personal Details
 </p>


      <p className="changePersonalDetails"
      onClick={()=>{

      changeDetails && onSubmit()
      setChangeDetails((prevState)=>!prevState)

      }}
        >
     {changeDetails ? 'done' : 'change' }       


      </p>
    



       </div>

         <div className="profileCard">

         <form>
           <input type="text" id="name" className={!changeDetails ?'profileName' : 'profileNameActive'
           } 
           value={name}
           disabled={!changeDetails}
           onChange={onChange}
           />

           <input type="text" id="name" className={!changeDetails ?'profileEmail' : 'profileEmailActive'
           } 
           value={email}
           disabled={!changeDetails}
           onChange={onChange}
           />


         </form>


         </div>

     <Link to='/create-listing' className='createListing'>
       <img src={homeIcon} alt="home"/>
       <p>Sell or rent your home</p>
       <img src={arrowRight} alt='arrow right'/>
     </Link>

    {!loading && listings?.length>0 && (
     <>
     <p className="listingsText">Your Listings</p>
     <ul className="listingsList">
        {listings.map((listing)=>(
        
   <ListingItem key={listing.id}
      listing={listing.data}
      id={listing.id}
     onDelete={()=>onDelete(listing.id)} 
     onEdit={()=>onEdit(listing.id)} 
      />
      ))} 
       
       
       </ul>
     
     
     </>
    )}


         </main>
      
    

     </div>
  
  
  </>
}

export default Profile
