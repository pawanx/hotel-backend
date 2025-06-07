const {initializeDB} = require("./db/db.connect")
const express = require("express");
const cors = require("cors")

const Hotel = require("./models/hotel.models")
const app = express();
app.use(cors());

app.use(express.json());

initializeDB();

async function createHotel(newHotel) {
    try{
        const hotel = new Hotel(newHotel);
        const savedHotel = await hotel.save()
        return savedHotel;
    } catch(error){
        throw error;
    }
}

app.post("/hotels",async (req,res) => {
    try {
        const savedHotel = await createHotel(req.body);
        res.status(201).json({message : "New Hotel create", hotel : savedHotel});
    } catch (error) {
        res.status(500).json({error : "Failed to create new Hotel."})
    }
})

//function to delete hotelbyId
async function deleteHotelByID(hotelId) {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(hotelId);
        return deletedHotel;
    } catch (error) {
        throw error;
    }
}

//exproess code to delete
app.delete("/hotels/:hotelId", async (req,res) => {
    try {
        const deletedHotel = await deleteHotelByID(req.params.hotelId);
        res.status(200).json({message : "Hotel deleted successfully", hoteldeletedis : deletedHotel});
    } catch (error) {
         res.status(500).json({error : "Unable to delete restaurant."})
    }
})

async function findAllHotels() {
    try{
        const allHotels = await Hotel.find()
        return allHotels;
    }catch(error){
        throw error
    }
}

//Program 1
app.get("/hotels",async(req,res) => {
    try {
        const hotels = await findAllHotels();
        if(hotels){
            res.json(hotels);
        }else{
            res.status(404).json({error : "No hotel found."})
        }
    } catch (error) {
        res.status(500).json({error : "An error occured while fetching hotels."})
    }
})

//Program 2
async function findHotelsByName(hotelName) {
    try{
        const hotel = await Hotel.findOne({name : hotelName})
        return hotel;
    }catch(error){
        throw error
    }
}
app.get("/hotels/:hotelName",async(req,res) => {
    try {
        const hotel = await findHotelsByName(req.params.hotelName);
        if(hotel){
            res.json(hotel)
        }else{
            res.status(404).json({error : "No hotel found."})
        }
    } catch (error) {
        res.status(500).json({error : "An error occured while fetching hotels."})
    }
})


//Program 3
async function findHotelByPhoneNo(phone) {
    try{
        const hotel = await Hotel.findOne({phoneNumber : phone})
        return hotel;
    }catch(error){
        throw error
    }
}

app.get("/hotels/directory/:phoneNumber",async (req,res) => {
    try {
        const hotel = await findHotelByPhoneNo(req.params.phoneNumber);
        if(hotel){
            res.json(hotel)
        }else{
            res.status(404).json({error : "No hotel found."})
        }
    } catch (error) {
        res.status(500).json({error : "An error occured while fetching hotels."})
    }
})

//Program 4
async function findRatedHotel(rating) {
    try{
        const allHotels = await Hotel.find({rating : rating})
        return allHotels
    }catch(error){
        throw error
    }
}

app.get("/hotels/rating/:hotelRating",async (req,res) => {
    try {
        const hotel = await findRatedHotel(req.params.hotelRating);
        if(hotel){
            res.json(hotel)
        }else{
            res.status(404).json({error : "No hotel found."})
        }
    } catch (error) {
        res.status(500).json({error : "An error occured while fetching hotels."})
    }
})

//Program 5
async function findCategoryHotels(category) {
    try{
        const allHotels = await Hotel.find({category : category})
        return allHotels;
    }catch(error){
        throw error
    }
}

app.get("/hotels/category/:hotelCategory",async (req,res) => {
    try {
        const hotel = await findCategoryHotels(req.params.hotelCategory);
        if(hotel){
            res.json(hotel)
        }else{
            res.status(404).json({error : "No hotel found."})
        }
    } catch (error) {
        res.status(500).json({error : "An error occured while fetching hotels."})
    }
})

//function to update hotel
async function updateHotel(id, dataTobeUpdated) {
    try{
        const updatedHotel = await Hotel.findByIdAndUpdate(id, dataTobeUpdated,{new:true})
        return updatedHotel
    } catch(error){
        console.log("An error occured while updating data",error)
    }
}

//express code to update hotel
app.post("/hotels/:hotelId",async (req,res) => {
    try {
        const hotelAfterUpdate = await updateHotel(req.params.hotelId,req.body);
        if(hotelAfterUpdate){
            res.status(200).json({message : "Hotel updated Successfully", newHotel : hotelAfterUpdate} );
        }else{
            res.status(404).json({message : "Hotel not found"})
        }
    } catch (error) {
        res.status(500).json({error : "Failed to update the hotel."})
    }
})

const PORT = 3000
app.listen(PORT,()=>{
    console.log("Server is running on the port : ",PORT);
})