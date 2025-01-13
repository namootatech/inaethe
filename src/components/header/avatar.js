import React from 'react'
import { createUseStyles } from 'react-jss'


const getColorAndBackground = (md5) => {
    const matches = md5.match(/.{2}/g)

    const [red, green, blue] = matches.map(hex => parseInt(hex, 16))

    // Formula from https://www.w3.org/TR/AERT/#color-contrast
    const luminance = (red * 0.299 + green * 0.587 + blue * 0.114) / 255

    const color = luminance > 0.6 ? '#222' : '#fff'

    return {
        background: `rgb(${[red, green, blue]})`,
        color,
    }
}

const getInitials = (user) => {
  return [user?.firstName?.charAt(0), user?.lastName?.charAt(0)];
}

const useStyles = createUseStyles({
	parent: ({ emailMd5, size }) => ({
		...getColorAndBackground(emailMd5),
		position: 'relative',
		width: size,
		height: size,
		borderRadius: '50%',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.15)',
	}),
	swatch: ({ initials, size }) => ({
		// scale the text size depending on avatar size and
		// number of initials
		fontSize: size / (1.4 * Math.max([...initials].length, 2)),
		position: 'absolute',
		fontFamily: 'sans-serif',
		userSelect: 'none',
	}),
	img: ({ size }) => ({
		position: 'absolute',
		width: size,
		height: size,
		top: 0,
		left: 0,
		borderRadius: '50%',
	}),
})

export const Avatar = ({
	emailMd5,
    user,
	size = 50,}) => {
	// 250px is large enough that it will suffice for most purposes,
	// but small enough that it won't require too much bandwidth.
	// We limit the minimum size to improve caching.
	const url = `https://www.gravatar.com/avatar/${emailMd5}?s=${String(
		Math.max(size, 250),
	)}&d=blank`

	const initials = getInitials(user)

	const c = useStyles({ emailMd5, size, initials })
    const name = user?.firstName + ' ' + user?.lastName;
    console.log("generating gravatar for ", name);
	return (
		<div className={c.parent}>
			<div aria-hidden='true' className={c.swatch}>
				{initials}
			</div>
			<img className={c.img} src={String(url)} alt={`${name}’s avatar`} />
		</div>
	)
}
