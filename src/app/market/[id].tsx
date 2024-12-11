import { useEffect, useState, useRef } from "react"
import { View, Alert, Modal, StatusBar, ScrollView } from "react-native"
import { Redirect, router, useLocalSearchParams } from "expo-router";


import { api } from "@/services/api"
import { PropsDetails } from "@/components/market/details";
import { Cover } from "@/components/market/cover";


type DataProps = PropsDetails & {
    cover: string
}

export default function Market() {
    const [data, setData] = useState<DataProps>()
    const [coupon, setCoupon] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [couponIsFetching, setCouponIsFetching] = useState(false)
    const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false)

    const params = useLocalSearchParams<{ id: string }>()

    console.log(params)

    async function fetchMarket() {
        try {
            const { data } = await api.get(`/markets/${params.id}`)
            setData(data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            Alert.alert("Erro", "Não foi possível carregar os dados", [
                {
                    text: "OK",
                    onPress: () => router.back(),
                },
            ])
        }
    }

    useEffect(() => {
        fetchMarket()
    }, [params.id, coupon])

    if (!data) {
        return <Redirect href="/home" />
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" hidden={isVisibleCameraModal} />

            <ScrollView showsVerticalScrollIndicator={false}>
                <Cover uri={data.cover} />
            </ScrollView>
        </View>
    )
}