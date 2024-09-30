export interface Leave {
    leaveType: string;
    startDate: Date;
    endDate: Date;
    status: string;
    reason?: string;
    totalLeaves: number;
}

