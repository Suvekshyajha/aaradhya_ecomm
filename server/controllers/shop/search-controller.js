



const Product = require('../../models/Product');
const { escapeRegExp } = require('../../helpers/validation');

// Upper bound for user search text - keeps the regex cheap and bounded
const MAX_KEYWORD_LENGTH = 100;

const searchProducts = async(req, res) => {
    try {
        // Support both params and query parameters
        const rawKeyword = req.params.keyword || req.query.keyword;
        
        if(!rawKeyword || typeof rawKeyword !== 'string'){
            return res.status(400).json({
                success: false,
                message: "Keyword is required and must be in string format"
            });
        }

        const keyword = rawKeyword.trim();

        if (!keyword) {
            return res.status(400).json({
                success: false,
                message: "Keyword is required and must be in string format"
            });
        }

        if (keyword.length > MAX_KEYWORD_LENGTH) {
            return res.status(400).json({
                success: false,
                message: `Search keyword must be at most ${MAX_KEYWORD_LENGTH} characters`
            });
        }

        // Escape regex metacharacters so input like ".*", "(a+)+" or "[invalid"
        // is searched literally instead of becoming a hostile/expensive pattern
        const regEx = new RegExp(escapeRegExp(keyword), 'i');
        const createSearchQuery = {
            $or: [
                {title: regEx},
                {description: regEx},
                {category: regEx},
                {brand: regEx}
            ]
        };
        
        const searchResults = await Product.find(createSearchQuery);
        
        res.status(200).json({
            success: true,
            data: searchResults
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error while searching products'
        });
    }
};

module.exports = {searchProducts};