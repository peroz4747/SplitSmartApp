export type SplitSmartState = {
    users: User[]
    costs: Cost[]
    userCostsData: MonthYearUserCosts | null
    allUserCostData: MonthYearUserCosts[] | null
};

export type User = {
    id: number
    name: string
    favColor: string
    income: number
    percentage: number
}

export type Cost = {
    id: number
    name: string
    amount: number
}

export type UserCosts = {
    id: number
    name: string
    favColor: string
    income: number
    percentage: number
    costs: Cost[]
}

export type MonthYearUserCosts = {
    monthYear: string
    userCosts: UserCosts[]
};