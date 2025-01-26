package com.portafolio.tareas.gestor_tareas.controller;

import com.portafolio.tareas.gestor_tareas.model.Tarea;
import com.portafolio.tareas.gestor_tareas.service.TareaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    @Autowired
    private TareaService tareaService;

    // Endpoint para obtener todas las tareas
    @GetMapping
    public ResponseEntity<List<Tarea>> getAllTareas() {
        List<Tarea> tareas = tareaService.obtenerTareas();
        return ResponseEntity.ok(tareas);
    }

    // Endpoint para obtener una tarea por ID
    @GetMapping("/{id}")
    public ResponseEntity<Tarea> getTareaById(@PathVariable Long id) {
        Tarea tarea = tareaService.obtenerTareaPorId(id);
        if (tarea == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tarea);
    }

    // Endpoint para agregar una nueva tarea
    @PostMapping
    public ResponseEntity<Tarea> addTarea(@RequestBody Tarea tarea) {
        Tarea nuevaTarea = tareaService.guardarTarea(tarea);
        return ResponseEntity.status(201).body(nuevaTarea);
    }

    // Endpoint para actualizar una tarea
    @PutMapping("/{id}")
    public ResponseEntity<Tarea> updateTarea(@PathVariable Long id, @RequestBody Tarea tareaDetails) {
        Tarea tareaActualizada = tareaService.actualizarTarea(id, tareaDetails);
        if (tareaActualizada == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tareaActualizada);
    }

    // Endpoint para eliminar una tarea
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTarea(@PathVariable Long id) {
        tareaService.eliminarTarea(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint para marcar una tarea como completada
    @PutMapping("/{id}/completar")
    public ResponseEntity<Tarea> completarTarea(@PathVariable Long id) {
        Tarea tareaCompletada = tareaService.marcarCompletada(id);
        if (tareaCompletada == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tareaCompletada);
    }

    // Endpoint para desmarcar una tarea como incompleta
    @PutMapping("/{id}/descompletar")
    public ResponseEntity<Tarea> descompletarTarea(@PathVariable Long id) {
        Tarea tareaDescompletada = tareaService.desmarcarCompletada(id);
        if (tareaDescompletada == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tareaDescompletada);
    }
}
