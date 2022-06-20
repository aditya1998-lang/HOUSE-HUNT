import {useEffect,useState} from 'react'
import {useParams} from 'react-router-dom'
import {collection,getDocs,query,where,orderBy,limit,startAfter} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'




function Offers() {
  
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(null)
  const [lastFetchedListing,setLastFetchedListing]=useState(null)
  const params = useParams()
  useEffect(() => {

    const fetchListings = async () => {
      try {
        //getreference
        const listingsRef = collection(db, 'listings')


        // console.log(params.categoryName);
        //create a query
        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(10))


        const listings = []

        //execute query
        const querySnap = await getDocs(q)
       
        const lastVisible=querySnap.docs[querySnap.docs.length-1]
        setLastFetchedListing(lastVisible)

        querySnap.forEach((doc) => {

          return listings.push({
            id: doc.id, data: doc.data()
          })
        })

        
        setListings(listings)
        setLoading(false)

      } catch (error) {
        toast.error('could not fetch listings')
        console.log(error)
      }



    }
    fetchListings()

  }, [])


  //pagination//loadmore
  const onFetchMoreListings=async()=>{
    try{
       //getreference
       const listingsRef=collection(db,'listings')
       
      //create a query
   const q=query(
       listingsRef,
       where('offer','==',true),
       orderBy('timestamp','desc'),
      startAfter( lastFetchedListing),
       limit(10)
       )

      

       
       //execute query
       const querySnap=await getDocs(q)
       
       const lastVisible=querySnap.docs[querySnap.docs.length-1]
       setLastFetchedListing(lastVisible)
       
       
       
       
       
       const listings=[]
   querySnap.forEach((doc)=>{

       return listings.push({
           id:doc.id,data:doc.data()
       })
   })
      
   console.log(listings);
     setListings((prevState)=>[...prevState,...listings])
     setLoading(false)

    }catch(error){
        toast.error('could not fetch listings')
    console.log(error)}
  
     

     }



  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>

          {params.categoryName === 'rent'
            ? 'Places for rent' : 'Places for sale'
          }

        </p>
      </header>
      {loading ? <Spinner /> : listings && listings.length > 0 ? <>
        <main>
          <ul className="categoryListings">
            {
              listings.map((listing) => (
                <ListingItem listing={listing.data} id={listing.id} key={listing.id} />
              ))
            }
          </ul>

        </main>

        < br/>
       < br/>
    {lastFetchedListing && (
      <p className="loadMore" onClick={onFetchMoreListings}>Load More</p>
    )}


      </> : <p>No Offers Available </p>
      }
    </div>
  )
}

export default Offers
