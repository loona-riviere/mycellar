import { Star } from 'lucide-react';


type RatingStarsProps = {
    rating: number | ''
    setRating: (value: number) => void
}

export function RatingStars({ rating, setRating }: RatingStarsProps) {
    return (
        <fieldset>
            <legend className="block text-sm font-medium">Note</legend>
            <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map(n => (
                    <label key={n}>
                        <input
                            type="radio"
                            name="rating"
                            value={n}
                            checked={rating === n}
                            onChange={() => setRating(n)}
                            className="sr-only"
                        />
                        <Star
                            className={`h-5 w-5 cursor-pointer ${
                                rating && rating >= n ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                        />
                    </label>
                ))}
            </div>
        </fieldset>
    )
}
