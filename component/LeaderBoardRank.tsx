import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAppTheme } from '../slice/AppSlices'
import { appColor } from './AppColor'
import tailwind from 'twrnc'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { users } from '../utilies/AppObjects'
import { selectUserInfo, selectUserRank, setUserRank } from '../slice/userSlice'
import { useQuery } from '@apollo/client'
import { GET_ALL_USER, GET_USER_BY_EMAIL } from '../graphql/queries'
import LoadingAppComponent from './LoadingAppComponent'

const LeaderBoardRank = () => {
    const [userDetails, setUserDetails] = useState<any>({})
    const appTheme = useSelector(selectAppTheme)
    const userRank = useSelector(selectUserRank)
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const getUserInfo = useSelector(selectUserInfo)

    const { data, loading, error } = useQuery(GET_ALL_USER)

    const userInfo = data?.getUserList

    const textColor = appTheme === "dark" ? appColor.secondaryDarkTextColor : appColor.secondaryLightTextColor

    const primary = appTheme === "dark"? appColor.primaryDarkColor : appColor.primaryColor 

    const containerColor = appTheme === "dark" ? appColor.darkContainerBackground: appColor.lightContainerBackground

    const color = appTheme === "dark" ? appColor.darkTextColor : appColor.lightTextColor

    const TopFiveLeader = userInfo?.sort((a, b) => b.coins - a.coins).slice(0, 5)

    useEffect(() => {
        const sortedUsers = userInfo.sort((a, b) => b.coins - a.coins);

        const currentUserIndex = sortedUsers.findIndex((user) => user.full_name === getUserInfo.name);

        if (currentUserIndex !== -1) {
            const currentUser = sortedUsers[currentUserIndex];
            setUserDetails(currentUser)
            dispatch(setUserRank(currentUserIndex + 1))
        } else {
            return
        }
    }, [])

  return (
    <View>
        {loading?
            <LoadingAppComponent />
            :
            error?
                <View style={[tailwind`flex-1 justify-center items-center`,]}>
                    <Text style={[tailwind`text-[16px]`, { color, fontFamily: "Lato-Bold" }]}>Oops! An error occur in our end. Check your internet connection and try again</Text>
                    <TouchableOpacity style={[tailwind`justify-center items-center px-4 mt-6 py-2 rounded-md`, { backgroundColor: primary }]} onPress={() => navigation.goBack()}>
                    <Text style={[tailwind`font-bold text-[16px]`, { color: appTheme === "dark" ? appColor.lightTextColor : appColor.darkTextColor, fontFamily: 'Lato-Bold' }]}>Click to reload</Text>
                    </TouchableOpacity>
                </View>
                :
            <View style={[tailwind`mt-4`]}>
                <View style={[tailwind`flex-row justify-between items-center p-2`]}>
                    <Text style={[
                        tailwind`font-semibold text-[16px]`,
                        { color, fontFamily: 'Lato-Bold' }
                    ]}>Top 5 LeaderBoard</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("leaderboard")} >
                        <View style={[tailwind`flex-row items-center`]}>
                            <Text style={[
                                tailwind` px-2 font-semibold`,
                                { color, fontFamily: 'Lato-Bold' }
                            ]}>See all</Text>
                            <AntDesign name="caretdown" size={12} color={color} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[tailwind`p-2 rounded-md my-2`, {backgroundColor: appColor.primaryDarkColor}]}>
                    <Text style={[tailwind`pl-4 font-semibold`, { fontFamily: 'Lato-Bold' }]}>Your rank</Text>
                    <View style={tailwind`flex-row items-center px-2`}>
                        <Text style={{color: appColor.lightTextColor, fontFamily: 'Lato-Bold'}}>{userRank}</Text>
                        <Image source={{ uri: userDetails?.image }} style={[tailwind`w-10 h-10 mx-3 rounded-full`]} />
                        <View style={tailwind`flex-1`}>
                            <Text style={[tailwind`font-semibold pb-1 text-[16px]`, { color: appColor.lightTextColor, fontFamily: 'Lato-Bold' }]}>{userDetails?.full_name}</Text>
                            <Text style={[tailwind`text-[13px]`, { color: "black", fontFamily: 'Lato-Regular' }]}>Over all Quiz</Text>
                        </View>
                        <TouchableOpacity style={[tailwind`w-[18px] justify-center items-center rounded-sm h-[18px] bg-white`]}>
                            <AntDesign name="caretdown" size={12} color={primary} />
                        </TouchableOpacity>
                    </View>
                </View>
                
                <FlatList
                    data={TopFiveLeader}
                    keyExtractor={(user) => user.id.toString()}
                    renderItem={({ item, index }) => {
                        if (item.name === userDetails.name) {
                            return null;
                        }
                        return(<View style={[tailwind`p-2 rounded-md my-2 ${item.name === userDetails.name && "hidden"}`, { backgroundColor: containerColor }]}>
                            <View style={tailwind`flex-row items-center px-2`}>
                                <Text style={{ color, fontFamily: 'Lato-Bold' }}>{index + 1}</Text>
                                <Image source={{ uri: item.image }} style={[tailwind`w-10 h-10 mx-3 rounded-full`]} />
                                <View style={tailwind`flex-1`}>
                                    <Text style={[tailwind`font-semibold pb-1 text-[16px]`, { color, fontFamily: 'Lato-Bold' }]}>{item.full_name}</Text>
                                </View>
                                <TouchableOpacity style={[tailwind`w-[18px] justify-center items-center rounded-sm h-[18px] bg-white`]}>
                                    <AntDesign name="caretdown" size={12} color={primary} />
                                </TouchableOpacity>
                            </View>
                        </View>)
                    }}
                />
            </View>
        }
    </View>
  )
}

export default LeaderBoardRank

const styles = StyleSheet.create({})