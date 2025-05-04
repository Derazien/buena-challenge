package com.buena

import androidx.compose.runtime.*
import org.jetbrains.compose.web.css.*
import org.jetbrains.compose.web.dom.*
import org.jetbrains.compose.web.renderComposable

fun main() {
    renderComposable(rootElementId = "root") {
        App()
    }
}

@Composable
fun App() {
    Div({ style { padding(16.px) } }) {
        H1 { Text("Buena Property Management") }
        
        // Navigation Menu
        Nav {
            Ul {
                Li { A(href = "#/dashboard") { Text("Dashboard") } }
                Li { A(href = "#/properties") { Text("Properties") } }
                Li { A(href = "#/tenants") { Text("Tenants") } }
                Li { A(href = "#/maintenance") { Text("Maintenance") } }
            }
        }
        
        // Main content area
        Main {
            Div({ style { 
                display(DisplayStyle.Flex)
                flexDirection(FlexDirection.Column)
                gap(16.px)
            }}) {
                // Dashboard cards will go here
                DashboardCard("Total Properties", "12")
                DashboardCard("Active Tenants", "45")
                DashboardCard("Open Tickets", "3")
                DashboardCard("Monthly Revenue", "$52,450")
            }
        }
    }
}

@Composable
fun DashboardCard(title: String, value: String) {
    Div({
        style {
            padding(16.px)
            backgroundColor(Color("#f3f4f6"))
            borderRadius(8.px)
            boxShadow("0 1px 3px rgba(0,0,0,0.1)")
        }
    }) {
        H3({ style { margin(0.px) } }) { Text(title) }
        P({ style { 
            fontSize(24.px)
            fontWeight("bold")
            margin(8.px, 0.px)
        }}) { Text(value) }
    }
} 