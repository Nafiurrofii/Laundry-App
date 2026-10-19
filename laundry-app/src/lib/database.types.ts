// ============================================================
// Database Types – mirrors the Supabase PostgreSQL schema
// ============================================================

// ---- ENUM TYPES ----

export type UserRole = 'admin' | 'cashier' | 'operator';

/**
 * Maps 1-to-1 with public.laundry_status in Supabase.
 * UI may display localised labels but must store these exact values.
 */
export type LaundryStatus = 'Received' | 'Processing' | 'Completed' | 'Picked Up';

export type PaymentStatus = 'Unpaid' | 'Paid' | 'Partially Paid';

export type PaymentMethod = 'Cash' | 'QRIS' | 'Bank Transfer';

// ---- TABLE ROW TYPES ----

export interface DbUser {
    user_id: string; // UUID – matches Supabase auth.users.id
    username: string;
    name: string;
    role: UserRole;
    created_at: string; // ISO 8601
}

export interface DbCustomer {
    customer_id: number; // BIGINT identity
    name: string;
    phone_number: string;
    address?: string | null;
    created_at: string;
}

export interface DbService {
    service_id: number; // BIGINT identity
    service_name: string;
    price_per_kg: number;
    is_active: boolean;
}

export interface DbTransaction {
    transaction_id: number; // BIGINT identity
    receipt_number: string; // e.g. "BLS-0128"

    customer_id: number;
    service_id: number;
    user_id: string; // UUID

    weight_kg: number;
    clothing_type: string;

    /** Snapshot of price_per_kg at the time the order was created */
    price_per_kg: number;
    total_price: number;

    status: LaundryStatus;

    payment_status: PaymentStatus;
    payment_method: PaymentMethod | null;
    amount_paid: number;

    received_at: string;
    completed_at: string | null;
    picked_up_at: string | null;
    paid_at: string | null;
}

export interface DbStatusHistory {
    history_id: number;
    transaction_id: number;
    status: LaundryStatus;
    changed_at: string;
    user_id: string; // UUID
}

// ---- JOINED / RELATIONAL TYPES ----

/**
 * A transaction row joined with its related customer, service, and user.
 * This is the primary type consumed by UI components.
 */
export interface TransactionWithRelations extends DbTransaction {
    customer: Pick<DbCustomer, 'customer_id' | 'name' | 'phone_number' | 'address'>;
    service: Pick<DbService, 'service_id' | 'service_name' | 'price_per_kg'>;
    user: Pick<DbUser, 'user_id' | 'name' | 'role'> | null;
}

// ---- DISPLAY HELPERS ----

/** Maps DB status enum to localised Indonesian label for UI display */
export const LAUNDRY_STATUS_LABEL: Record<LaundryStatus, string> = {
    Received: 'Diterima',
    Processing: 'Diproses',
    Completed: 'Siap Diambil',
    'Picked Up': 'Selesai',
};

/** Maps DB payment_status to localised Indonesian label */
export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
    Unpaid: 'Belum Lunas',
    Paid: 'Lunas',
    'Partially Paid': 'Bayar Sebagian',
};

/** Maps DB payment_method to localised Indonesian label */
export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
    Cash: 'Tunai',
    QRIS: 'QRIS',
    'Bank Transfer': 'Transfer Bank',
};

// ---- SUPABASE DATABASE DEFINITION ----

export interface Database {
    public: {
        Tables: {
            users: {
                Row: DbUser;
                Insert: {
                    user_id: string;
                    username: string;
                    name: string;
                    role?: UserRole;
                    created_at?: string;
                };
                Update: {
                    user_id?: string;
                    username?: string;
                    name?: string;
                    role?: UserRole;
                    created_at?: string;
                };
                Relationships: [];
            };
            customers: {
                Row: DbCustomer;
                Insert: {
                    customer_id?: number;
                    name: string;
                    phone_number: string;
                    address?: string | null;
                    created_at?: string;
                };
                Update: {
                    customer_id?: number;
                    name?: string;
                    phone_number?: string;
                    address?: string | null;
                    created_at?: string;
                };
                Relationships: [];
            };
            services: {
                Row: DbService;
                Insert: {
                    service_id?: number;
                    service_name: string;
                    price_per_kg: number;
                    is_active?: boolean;
                };
                Update: {
                    service_id?: number;
                    service_name?: string;
                    price_per_kg?: number;
                    is_active?: boolean;
                };
                Relationships: [];
            };
            transactions: {
                Row: DbTransaction;
                Insert: {
                    transaction_id?: number;
                    receipt_number: string;
                    customer_id: number;
                    service_id: number;
                    user_id: string;
                    weight_kg: number;
                    clothing_type: string;
                    price_per_kg: number;
                    total_price: number;
                    status?: LaundryStatus;
                    payment_status?: PaymentStatus;
                    payment_method?: PaymentMethod | null;
                    amount_paid?: number;
                    received_at?: string;
                    completed_at?: string | null;
                    picked_up_at?: string | null;
                    paid_at?: string | null;
                };
                Update: {
                    transaction_id?: number;
                    receipt_number?: string;
                    customer_id?: number;
                    service_id?: number;
                    user_id?: string;
                    weight_kg?: number;
                    clothing_type?: string;
                    price_per_kg?: number;
                    total_price?: number;
                    status?: LaundryStatus;
                    payment_status?: PaymentStatus;
                    payment_method?: PaymentMethod | null;
                    amount_paid?: number;
                    received_at?: string;
                    completed_at?: string | null;
                    picked_up_at?: string | null;
                    paid_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'transactions_customer_id_fkey';
                        columns: ['customer_id'];
                        isOneToOne: false;
                        referencedRelation: 'customers';
                        referencedColumns: ['customer_id'];
                    },
                    {
                        foreignKeyName: 'transactions_service_id_fkey';
                        columns: ['service_id'];
                        isOneToOne: false;
                        referencedRelation: 'services';
                        referencedColumns: ['service_id'];
                    },
                    {
                        foreignKeyName: 'transactions_user_id_fkey';
                        columns: ['user_id'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['user_id'];
                    },
                ];
            };
            status_history: {
                Row: DbStatusHistory;
                Insert: {
                    history_id?: number;
                    transaction_id: number;
                    status: LaundryStatus;
                    changed_at?: string;
                    user_id: string;
                };
                Update: {
                    history_id?: number;
                    transaction_id?: number;
                    status?: LaundryStatus;
                    changed_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
        };
        Views: Record<string, never>;
        Functions: {
            current_user_role: {
                Args: Record<string, never>;
                Returns: UserRole;
            };
        };
        Enums: {
            user_role: UserRole;
            laundry_status: LaundryStatus;
            payment_status: PaymentStatus;
            payment_method: PaymentMethod;
        };
        CompositeTypes: Record<string, never>;
    };
}

