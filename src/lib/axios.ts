import axios from "axios"

// بنستخدم /api عشان Next.js يعمل proxy — الـ rewrite في next.config.ts
const axiosInstance = axios.create({
  baseURL: "/api/v1",
  withCredentials: true, // مهم للـ refresh_token cookie
  headers: {
    "Content-Type": "application/json",
  },
})

// ── Request Interceptor ──────────────────────────────────────────
// بيضيف الـ access_token في كل request أوتوماتيك
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access_token") : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor ─────────────────────────────────────────
// لو جاله 401 → يعمل refresh تلقائي، لو فشل → logout
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // لو الـ error مش 401 أو الـ request ده اتعمل retry قبل كده → reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // لو في refresh جاري → حط الـ request في queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axiosInstance(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      // اطلب token جديد
      const { data } = await axiosInstance.get("/auth/refresh-token")
      const newToken: string = data.access_token

      // احفظ الـ token الجديد
      localStorage.setItem("access_token", newToken)

      // حدّث الـ header
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`
      originalRequest.headers.Authorization = `Bearer ${newToken}`

      processQueue(null, newToken)
      return axiosInstance(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)

      // فشل الـ refresh → logout
      localStorage.removeItem("access_token")
      localStorage.removeItem("user")

      // روّح لصفحة الـ login
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }

      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default axiosInstance