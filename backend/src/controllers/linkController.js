import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Link from '../models/link.model.js';

const newLink = asyncHandler ( async (req, res) => {
    const {longLink} = req.body;

    if(!longLink) {
        return next(new ApiError(400, "long link required"))
    }

    //create a new code
    const shortCode = await getShortCode();

    

    //save the generated code to new link in db
    const newLink = new Link({
        shortCode: shortCode,
        longLink: longLink,
        clickCount: 0,
        qr: ''
    })

    if(!newLink) {
        throw new ApiError(400, "Failed to create short link!")
    }

    await newLink.save();

    //return the json
    res.json(
        new ApiResponse(201, newLink, "Shortlink generated successfully!")
    )
})

async function getShortCode() {
    let code;
    let exist = true;

    while(exist) {
        code = generateShortCode();
        exist = await Link.findOne({shortCode: code});
    }

    return code;
}

function generateShortCode( length = 5) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let shortCode = "";
    for( let i = 0; i < length; i++) {
        shortCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return shortCode;
}


const getRedirectInfo = asyncHandler( async (req, res) => {
    const { shortCode } = req.params;

    const link = await Link.findOne({shortCode: shortCode});

    if(!link) {
        return res.status(404).json({
            success: false,
            message: "Link not found!"
        })
    }

    link.clickCount +=1;
    await link.save();

    res.json(
        new ApiResponse(200, link, "Original link found!")
    )

    if(link.clickCount >= 5) {
        await Link.deleteOne({shortCode: shortCode});
        console.log(`Short link with code: ${shortCode} is deleted after exceeding limit!`)
    }
})

export {
    newLink,
    getRedirectInfo
}